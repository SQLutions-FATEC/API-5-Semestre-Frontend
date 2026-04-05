import { fireEvent, render, screen } from '@testing-library/react';
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
  { 
    data: '2024-11-03', 
    total_custo: 18630.80, 
    materiais: [
      { codigo_material: 'MAT1', descricao: 'Resistor', custo_unitario: 50, quantidade: 2, total_custo: 100 },
      { codigo_material: 'UNKNOWN', descricao: 'Desconhecido', custo_unitario: 10, quantidade: 1, total_custo: 10 }
    ] 
  },
  { 
    data: '2024-11-04', 
    total_custo: 23630.80, 
    materiais: [
      { codigo_material: 'MAT2', descricao: 'Capacitor', custo_unitario: 100, quantidade: 2, total_custo: 200 }
    ] 
  }
];

const mockEmpenhoMaterial = [
  { codigo_material: 'MAT1', descricao: 'Resistor', categoria: 'Conector', total_custo: 100 },
  { codigo_material: 'MAT2', descricao: 'Capacitor', categoria: 'Sensor', total_custo: 200 }
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

  it('deve alternar a visualização e mudar os títulos para o modo Categoria', () => {
    render(
      <CommitmentCharts 
        empenhoCategoria={mockEmpenhoCategoria} 
        empenhoTempo={mockEmpenhoTempo} 
        empenhoMaterial={mockEmpenhoMaterial}
        total={18630.80} 
      />
    );

    // Initial state check
    expect(screen.getByText('Custo por categoria')).toBeDefined();

    // Find the select element and change its value
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'categoria' } });

    // After change, the title should be "Custo por material"
    expect(screen.getByText('Custo por material')).toBeDefined();
    expect(screen.queryByText('Custo por categoria')).toBeNull();
  });
});