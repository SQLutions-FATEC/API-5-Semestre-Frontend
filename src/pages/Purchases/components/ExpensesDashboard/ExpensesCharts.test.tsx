import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesCharts from './ExpensesCharts';
import { describe, it, expect, vi } from 'vitest';

vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({
      data,
      children,
    }: {
      data: { name: string; value: number }[];
      children: React.ReactNode;
    }) => (
      <div data-testid="pie">
        {data?.map((item, i) => (
          <div key={i} data-testid="pie-slice">
            {item.name}: {item.value}
          </div>
        ))}
        {children}
      </div>
    ),
    Legend: ({
      payload,
      formatter,
    }: {
      payload: { value: string }[];
      formatter?: (value: string) => string;
    }) => (
      <div data-testid="legend">
        {payload?.map((entry, i) => (
          <div key={i} data-testid="legend-item">
            {formatter ? formatter(entry.value) : entry.value}
          </div>
        ))}
        {formatter && <div data-testid="legend-manual">{formatter('Manual Item')}</div>}
      </div>
    ),
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: ({ tickFormatter }: { tickFormatter?: (value: number) => string }) => (
      <div data-testid="y-axis">
        <span>{tickFormatter ? tickFormatter(500) : ''}</span>
        <span>{tickFormatter ? tickFormatter(1500) : ''}</span>
      </div>
    ),
    Tooltip: ({
      labelFormatter,
      formatter,
    }: {
      labelFormatter?: (label: string) => string;
      formatter?: (value: number) => [string, string];
    }) => (
      <div data-testid="tooltip">
        {labelFormatter && <span>{labelFormatter('2022-05')}</span>}
        {formatter && <span data-testid="tooltip-value">{JSON.stringify(formatter(1000))}</span>}
      </div>
    ),
    CartesianGrid: () => <div data-testid="grid" />,
    Cell: () => <div data-testid="cell" />,
  };
});

const mockEvolution = [{ data: '2022-05', total_gasto: 1500 }];

const mockPedidos = [
  {
    numero_pedido: 'PC1',
    material_nome: 'Material A',
    fornecedor_nome: 'Forn',
    valor_total_pedido: 500,
    status: 'ENTREGUE',
  },
  {
    numero_pedido: 'PC2',
    material_nome: 'Material B',
    fornecedor_nome: 'Forn',
    valor_total_pedido: 1000,
    status: 'ENTREGUE',
  },
];

describe('ExpensesCharts', () => {
  it('covers sorting and formatters (Lines 51, 86-91, 153-162)', () => {
    render(<ExpensesCharts evolution={mockEvolution} total={1500} pedidos={mockPedidos} />);

    const slices = screen.getAllByTestId('pie-slice');
    expect(slices[0]).toHaveTextContent('Material B: 1000');
    expect(slices[1]).toHaveTextContent('Material A: 500');

    expect(screen.getByText('R$ 500')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.5k')).toBeInTheDocument();

    const tooltips = screen.getAllByTestId('tooltip-value');
    expect(tooltips.some((t) => t.textContent?.includes('Total Gasto'))).toBe(true);
  });

  it('handles empty states', () => {
    render(<ExpensesCharts evolution={[]} total={0} pedidos={[]} />);
    expect(screen.getByText('Nenhum gasto registrado')).toBeInTheDocument();
  });
});
