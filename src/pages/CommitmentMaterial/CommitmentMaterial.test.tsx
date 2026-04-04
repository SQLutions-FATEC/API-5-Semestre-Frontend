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
    expect(screen.getByText('Relé 12V 5A DPDT')).toBeDefined();
  });

  it('deve filtrar a lista quando uma categoria diferente for selecionada', () => {
    render(<CommitmentMaterial />);
    
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'Sensor' } });
    
    expect(screen.getByText('Sensor Corrente ACS712')).toBeDefined();
    const microcontrolador = screen.queryByText('Microcontrolador ARM Cortex-M4');
    expect(microcontrolador).toBeNull();
  });

  it('deve calcular o total corretamente com base nos dados iniciais', () => {
    render(<CommitmentMaterial />);

    expect(screen.getByText(/3700/)).toBeDefined();
  });

  it('deve atualizar o total ao filtrar por uma categoria específica', () => {
    render(<CommitmentMaterial />);
    
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'Relé' } });
    
    expect(screen.getByText(/375/)).toBeDefined();
    expect(screen.queryByText(/3700/)).toBeNull();
  });
});