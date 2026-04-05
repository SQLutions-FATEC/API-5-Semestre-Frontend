import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../services/commitmentService';
import CommitmentCharts from './CommitmentCharts';

// Mock do Recharts para evitar problemas de renderização de SVG no JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

const mockEmpenhoCategoria: EmpenhoCategoria[] = [
  { categoria: 'Conector', total_custo: 18630.80 },
  { categoria: 'Sensor', total_custo: 5000.00 }
];

const mockEmpenhoTempo: EmpenhoTempo[] = [
  { data: '2024-11-03', total_custo: 18630.80, materiais: [] },
  { data: '2024-11-04', total_custo: 23630.80, materiais: [] }
];

describe('CommitmentCharts Component', () => {
  it('deve renderizar os títulos de identificação de ambos os gráficos', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} total={18630.80} />);

    expect(screen.getByText('Custo empenhado')).toBeDefined();
    expect(screen.getByText('Custo por categoria')).toBeDefined();
  });

  it('deve renderizar exatamente dois containers de gráficos (Linhas e Rosca)', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} total={18630.80} />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(2);
  });

  it('deve renderizar a tag de gasto total formatada corretamente', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} total={18630.80} />);

    // Verifica se a string formatada aparece na tela (ex: R$ 18.630,80)
    expect(screen.getByText(/18\.630,80/)).toBeDefined();
  });
});