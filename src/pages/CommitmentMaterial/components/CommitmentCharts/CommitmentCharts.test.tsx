import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../services/commitmentService';
import CommitmentCharts from './CommitmentCharts';

// Mock do Recharts para evitar problemas de renderização de SVG no JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    // Substitui o ResponsiveContainer por uma div simples para o teste conseguir renderizar os filhos
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

// Mock dos novos dados que vêm da API
const mockEmpenhoCategoria: EmpenhoCategoria[] = [
  { categoria: 'Conector', total_custo: 18630.80 },
  { categoria: 'Sensor', total_custo: 5000.00 }
];

const mockEmpenhoTempo: EmpenhoTempo[] = [
  { data: '2024-11-03', total_custo: 18630.80, materiais: [] },
  { data: '2024-11-04', total_custo: 23630.80, materiais: [] }
];

describe('CommitmentCharts Component', () => {
  it('deve renderizar o cabeçalho principal do card de gráficos', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} />);

    // Verifica se o título geral do componente está na tela
    expect(screen.getByText('Análise de Custos e Empenhos')).toBeDefined();
  });

  it('deve renderizar os títulos de identificação de ambos os gráficos', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} />);

    // Verifica se os rótulos de cada gráfico estão presentes
    expect(screen.getByText('Custo por Categoria')).toBeDefined();
    expect(screen.getByText('Evolução do Empenho')).toBeDefined();
  });

  it('deve renderizar exatamente dois containers de gráficos (Barras e Linhas)', () => {
    render(<CommitmentCharts empenhoCategoria={mockEmpenhoCategoria} empenhoTempo={mockEmpenhoTempo} />);

    // Procura pela div que mockamos no ResponsiveContainer do Recharts
    const containers = screen.getAllByTestId('responsive-container');

    // Esperamos 2 containers: 1 do BarChart e 1 do LineChart
    expect(containers).toHaveLength(2);
  });
});