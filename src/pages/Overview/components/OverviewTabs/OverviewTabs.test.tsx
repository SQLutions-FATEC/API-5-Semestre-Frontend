import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OverviewTabs from './OverviewTabs';

vi.mock('../../../CommitmentMaterial/CommitmentMaterial', () => ({
  default: () => <div data-testid="commitment-material-mock">Mock Commitment Material</div>,
}));

vi.mock('../HoursTracking/HoursTracking', () => ({
  default: () => <div data-testid="hours-tracking-mock">Mock Hours Tracking</div>,
}));

describe('OverviewTabs Component', () => {
  it('deve renderizar a aba padrão (Empenho de Materiais) inicialmente', () => {
    render(<OverviewTabs />);

    // Verifica se os seletores (abas) estão presentes
    expect(screen.getByText('Empenho de Materiais')).toBeDefined();
    expect(screen.getByText('Rastreamento de Tarefas')).toBeDefined();

    // Verifica se o conteúdo padrão de "Empenho de Materiais" está renderizado
    expect(screen.getByTestId('commitment-material-mock')).toBeDefined();

    // Rastreamento de Tarefas não deve estar na tela logicamente
    expect(screen.queryByTestId('hours-tracking-mock')).toBeNull();
  });

  it('deve trocar o conteúdo e exibir HoursTracking quando a aba Rastreamento de Tarefas é clicada', () => {
    render(<OverviewTabs />);

    // Procura o botão (aba) e clica nele
    const taskTrackingTab = screen.getByText('Rastreamento de Tarefas');
    fireEvent.click(taskTrackingTab);

    // O conteúdo deve trocar de material para horas
    expect(screen.getByTestId('hours-tracking-mock')).toBeDefined();
    expect(screen.queryByTestId('commitment-material-mock')).toBeNull();
  });
});
