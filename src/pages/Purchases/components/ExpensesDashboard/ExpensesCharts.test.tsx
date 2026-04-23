import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesCharts from './ExpensesCharts';
import { describe, it, expect, vi } from 'vitest';

// Thoroughly mocking Recharts to render readable text in JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
    Pie: ({ data, children }: any) => (
      <div data-testid="pie">
        {data?.map((item: any, i: number) => (
          <div key={i} data-testid="pie-slice">{item.name}: {item.value}</div>
        ))}
        {children}
      </div>
    ),
    Legend: ({ payload, formatter }: any) => (
      <div data-testid="legend">
        {payload?.map((entry: any, i: number) => (
          <div key={i} data-testid="legend-item">{formatter ? formatter(entry.value) : entry.value}</div>
        ))}
        {/* Manually trigger formatter for coverage (Line 162) */}
        {formatter && (
          <div data-testid="legend-manual">
            {formatter('Manual Item')}
          </div>
        )}
      </div>
    ),
    Line: () => <div data-testid="line" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: ({ tickFormatter }: any) => (
      <div data-testid="y-axis">
        {/* Call formatter for coverage (Lines 86-87) */}
        <span>{tickFormatter ? tickFormatter(500) : ''}</span>
        <span>{tickFormatter ? tickFormatter(1500) : ''}</span>
      </div>
    ),
    Tooltip: ({ labelFormatter, formatter }: any) => (
      <div data-testid="tooltip">
        {/* Call formatters for coverage (Lines 90-94, 153-154) */}
        {labelFormatter && <span>{labelFormatter('2022-05')}</span>}
        {formatter && <span data-testid="tooltip-value">{JSON.stringify(formatter(1000))}</span>}
      </div>
    ),
    CartesianGrid: () => <div data-testid="grid" />,
    Cell: () => <div data-testid="cell" />,
  };
});

const mockEvolution = [
  { data: '2022-05', total_gasto: 1500 },
];

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
    
    // Line 51 (Sort)
    const slices = screen.getAllByTestId('pie-slice');
    expect(slices[0]).toHaveTextContent('Material B: 1000');
    expect(slices[1]).toHaveTextContent('Material A: 500');

    // Lines 86-87 (YAxis Tick)
    expect(screen.getByText('R$ 500')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.5k')).toBeInTheDocument();

    // Line 162 (Legend Formatter) - Using getAllByTestId because there are two charts
    const manualLegends = screen.getAllByTestId('legend-manual');
    expect(manualLegends[0]).toHaveTextContent('Manual Item');
    
    // Tooltip coverage (Lines 90-94, 153-154)
    const tooltips = screen.getAllByTestId('tooltip-value');
    expect(tooltips.some(t => t.textContent?.includes('Total Gasto'))).toBe(true);
  });

  it('handles empty states', () => {
    render(<ExpensesCharts evolution={[]} total={0} pedidos={[]} />);
    expect(screen.getByText('Nenhum gasto registrado')).toBeInTheDocument();
  });
});
