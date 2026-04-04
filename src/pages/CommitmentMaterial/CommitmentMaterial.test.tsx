import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CommitmentMaterial from './CommitmentMaterial';

vi.mock('../Overview/components/ProjectOverviewHeader/ProjectOverviewHeader', () => ({
  default: () => <div data-testid="header">Header</div>
}));
vi.mock('./components/CommitmentCharts/CommitmentCharts', () => ({
  default: () => <div data-testid="charts">Charts</div>
}));

describe('CommitmentMaterial Component', () => {
  it('deve renderizar o componente e mostrar o título do filtro', () => {
    render(<CommitmentMaterial />);
    
    expect(screen.getByText('Filtrar por Categoria:')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('deve renderizar a lista completa de materiais por padrão', () => {
    render(<CommitmentMaterial />);
    
    expect(screen.getByText('Microcontrolador ARM Cortex-M4')).toBeDefined();
    
    // Como é obsoleto, aparece na tabela e no card lateral. Usamos getAllByText.
    expect(screen.getAllByText('Relé 12V 5A DPDT').length).toBeGreaterThan(0);
  });

  it('deve filtrar a lista quando uma categoria diferente for selecionada', () => {
    render(<CommitmentMaterial />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Sensor' } });
    
    // Sensor também é obsoleto, aparece em dois lugares.
    expect(screen.getAllByText('Sensor Corrente ACS712').length).toBeGreaterThan(0);
    
    const microcontrolador = screen.queryByText('Microcontrolador ARM Cortex-M4');
    expect(microcontrolador).toBeNull();
  });

  it('deve calcular o total corretamente com base nos dados iniciais', () => {
    render(<CommitmentMaterial />);

    // A formatação do toLocaleString inclui um ponto na milhar (3.700,00)
    expect(screen.getByText(/3\.700,00/)).toBeDefined();
  });

  it('deve atualizar o total ao filtrar por uma categoria específica', () => {
    render(<CommitmentMaterial />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Relé' } });
    
    // O valor 375 aparece duas vezes: no custo do item e no total geral
    expect(screen.getAllByText(/375,00/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/3\.700,00/)).toBeNull();
  });
});