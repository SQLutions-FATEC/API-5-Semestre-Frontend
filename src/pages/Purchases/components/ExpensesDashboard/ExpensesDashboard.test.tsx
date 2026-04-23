import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesDashboard from './ExpensesDashboard';
import { projectService } from '../../../../services/projectService';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../../../services/projectService', () => ({
  projectService: {
    getExpensesDetails: vi.fn(),
    getExpensesEvolution: vi.fn(),
  },
}));

describe('ExpensesDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (projectService.getExpensesDetails as any).mockImplementation(() => new Promise(() => {}));
    (projectService.getExpensesEvolution as any).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ExpensesDashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state on API failure', async () => {
    (projectService.getExpensesDetails as any).mockRejectedValue(new Error('API error'));
    (projectService.getExpensesEvolution as any).mockRejectedValue(new Error('API error'));

    render(
      <MemoryRouter>
        <ExpensesDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Não existem dados de gastos cadastrados para este projeto.')
      ).toBeInTheDocument();
    });
  });

  it('renders the dashboard components on successful data fetch', async () => {
    const mockDetails = {
      gasto_total_consolidado: 1000,
      pedidos: [
        {
          numero_pedido: 'PC001',
          material_nome: 'Material 1',
          fornecedor_nome: 'Fornecedor 1',
          valor_total_pedido: 1000,
          status: 'ENTREGUE',
        },
      ],
    };
    const mockEvolution = [{ data: '2022-05', total_gasto: 500 }];

    (projectService.getExpensesDetails as any).mockResolvedValue(mockDetails);
    (projectService.getExpensesEvolution as any).mockResolvedValue(mockEvolution);

    render(
      <MemoryRouter initialEntries={['/purchases/PRJ003']}>
        <Routes>
          <Route path="/purchases/:id" element={<ExpensesDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Evolução do Gasto')).toBeInTheDocument();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('PC001')).toBeInTheDocument();
    });
  });

  it('fetches correct id from url params', async () => {
    (projectService.getExpensesDetails as any).mockResolvedValue({ pedidos: [] });
    (projectService.getExpensesEvolution as any).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/purchases/custom-id']}>
        <Routes>
          <Route path="/purchases/:id" element={<ExpensesDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(projectService.getExpensesDetails).toHaveBeenCalledWith('custom-id');
    });
  });

  it('uses PRJ003 for id=1 special case', async () => {
    (projectService.getExpensesDetails as any).mockResolvedValue({ pedidos: [] });
    (projectService.getExpensesEvolution as any).mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/purchases/1']}>
        <Routes>
          <Route path="/purchases/:id" element={<ExpensesDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(projectService.getExpensesDetails).toHaveBeenCalledWith('PRJ003');
    });
  });
});
