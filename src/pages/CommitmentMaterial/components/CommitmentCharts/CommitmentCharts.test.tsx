import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../types/commitment';
import CommitmentCharts from './CommitmentCharts';

// Mock do Recharts para evitar problemas de renderização de SVG no JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

const mockEmpenhoCategoria: EmpenhoCategoria[] = [
  { categoria: 'Conector', total_custo: 18630.8 },
  { categoria: 'Sensor', total_custo: 5000.0 },
];

const mockEmpenhoTempo: EmpenhoTempo[] = [
  {
    data: '2024-11-03',
    total_custo: 18630.8,
    materiais: [
      {
        codigo_material: 'MAT1',
        total_custo: 100,
      },
    ],
  },
];

const mockEmpenhoMaterial = [
  {
    codigo_material: 'MAT1',
    fornecedor: 'Fornecedor A',
    descricao: 'Resistor',
    categoria: 'Conector',
    total_custo: 100,
  },
];

describe('CommitmentCharts Component', () => {
  it('deve renderizar os títulos de identificação de ambos os gráficos', () => {
    render(
      <CommitmentCharts
        empenhoCategoria={mockEmpenhoCategoria}
        empenhoTempo={mockEmpenhoTempo}
        total={18630.8}
      />
    );

    // Títulos atualizados conforme o novo componente
    expect(screen.getByText('Evolução do Gasto')).toBeDefined();
    expect(screen.getByText('Custo por Categoria')).toBeDefined();
  });

  it('deve renderizar exatamente dois containers de gráficos (Linhas e Rosca)', () => {
    render(
      <CommitmentCharts
        empenhoCategoria={mockEmpenhoCategoria}
        empenhoTempo={mockEmpenhoTempo}
        total={18630.8}
      />
    );

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(2);
  });

  it('deve renderizar o novo card de KPI com o gasto total formatado', () => {
    render(
      <CommitmentCharts
        empenhoCategoria={mockEmpenhoCategoria}
        empenhoTempo={mockEmpenhoTempo}
        total={18630.8}
      />
    );

    // Verifica o label do KPI
    expect(screen.getByText('Gasto Total em Pedidos')).toBeDefined();

    // Verifica se a string formatada aparece na tela (R$ 18.630,80)
    // Usamos regex para ignorar espaços em branco especiais do toLocaleString
    expect(screen.getByText(/18\.630,80/)).toBeDefined();
  });

  it('deve alternar a visualização e mudar os títulos para o modo Material', () => {
    render(
      <CommitmentCharts
        empenhoCategoria={mockEmpenhoCategoria}
        empenhoTempo={mockEmpenhoTempo}
        empenhoMaterial={mockEmpenhoMaterial}
        total={18630.8}
      />
    );

    // Estado inicial: Geral
    expect(screen.getByText('Custo por Categoria')).toBeDefined();

    // Encontra o select e muda para 'categoria' (que no seu componente representa "Material")
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'categoria' } });

    // Após a mudança, o título do gráfico de pizza deve mudar
    expect(screen.getByText('Distribuição por Material')).toBeDefined();
    expect(screen.queryByText('Custo por Categoria')).toBeNull();
  });

  it('deve exibir o seletor com as opções corretas', () => {
    render(
      <CommitmentCharts
        empenhoCategoria={mockEmpenhoCategoria}
        empenhoTempo={mockEmpenhoTempo}
        total={18630.8}
      />
    );

    expect(screen.getByText('Empenho por:')).toBeDefined();
    expect(screen.getByText('Geral')).toBeDefined();
    expect(screen.getByText('Material')).toBeDefined();
  });
});
