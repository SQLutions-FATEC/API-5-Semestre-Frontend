import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommitmentCharts from './CommitmentCharts';
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  };
});

const mockAll = [
  { id: '1', name: 'M1', category: 'Cat1', amount_committed: 1, unit_cost: 10, commitment_date: '', status: '' }
];

describe('CommitmentCharts Component', () => {
  it('deve renderizar apenas o gráfico geral quando a categoria for "todas"', () => {
    render(<CommitmentCharts allData={mockAll} filteredData={mockAll} selectedCategory="todas" />);
    
    expect(screen.getByText('Visão Geral: Categorias')).toBeDefined();

    expect(screen.queryByText(/Itens em:/)).toBeNull();
  });

  it('deve renderizar o segundo gráfico quando uma categoria específica for selecionada', () => {
    render(<CommitmentCharts allData={mockAll} filteredData={mockAll} selectedCategory="Cat1" />);
    
    expect(screen.getByText('Itens em: Cat1')).toBeDefined();
  });
});