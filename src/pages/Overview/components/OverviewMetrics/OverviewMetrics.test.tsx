import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OverviewMetrics from './OverviewMetrics';
import { describe, it, expect } from 'vitest';

const mockFinanceiro = {
  total_horas_trabalhadas: 10.5, // 10h 30m
  horas_totais_estimadas: 20.999, // rounds to 21h 00m
  custo_total_materiais: 5000,
  custo_total_projeto: 12000,
};

describe('OverviewMetrics', () => {
  it('renders all metric cards with correct titles', () => {
    render(<OverviewMetrics financeiro={mockFinanceiro} />);

    expect(screen.getByText('Total em Horas Trabalhadas')).toBeInTheDocument();
    expect(screen.getByText('Total de Horas Previstas')).toBeInTheDocument();
    expect(screen.getByText('Valor Empenhado')).toBeInTheDocument();
    expect(screen.getByText('Gasto Total')).toBeInTheDocument();
  });

  it('formats hours correctly including edge cases', () => {
    const { rerender } = render(<OverviewMetrics financeiro={mockFinanceiro} />);

    // 10.5 -> 10h 30m
    expect(screen.getByText('10h 30m')).toBeInTheDocument();

    // 20.999 -> 21h 00m (due to minutes === 60 branch)
    expect(screen.getByText('21h 00m')).toBeInTheDocument();

    // Test NaN/undefined branch
    rerender(
      <OverviewMetrics financeiro={{ ...mockFinanceiro, total_horas_trabalhadas: NaN } as any} />
    );
    expect(screen.getAllByText('0h 00m').length).toBeGreaterThan(0);
  });

  it('formats currency correctly', () => {
    render(<OverviewMetrics financeiro={mockFinanceiro} />);

    // Use regex to handle non-breaking spaces in currency format
    expect(screen.getByText(/R\$.*5\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$.*12\.000,00/)).toBeInTheDocument();
  });

  it('renders default values when financeiro is missing', () => {
    render(<OverviewMetrics />);

    expect(screen.getAllByText('0h 00m').length).toBe(2);
    expect(screen.getAllByText('R$ 0,00').length).toBe(2);
  });
});
