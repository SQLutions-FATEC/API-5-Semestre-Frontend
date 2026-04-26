import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackingDashboard from './TrackingDashboard';
import { projectService } from '../../../../services/projectService';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../../../services/projectService', () => ({
  projectService: {
    getPurchases: vi.fn(),
    getCriticalAlerts: vi.fn(),
  },
}));

describe('TrackingDashboard', () => {
  it('renders loading state initially', () => {
    vi.mocked(projectService.getPurchases).mockImplementation(() => new Promise(() => {}));
    vi.mocked(projectService.getCriticalAlerts).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <TrackingDashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state on API failure', async () => {
    vi.mocked(projectService.getPurchases).mockRejectedValue(new Error('API error'));
    vi.mocked(projectService.getCriticalAlerts).mockRejectedValue(new Error('API error'));

    render(
      <MemoryRouter>
        <TrackingDashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar as informações de acompanhamento.')
      ).toBeInTheDocument();
    });
  });

  it('renders the dashboard components on successful data fetch', async () => {
    const mockCompras = { projeto: 'PRJ003', tempo_medio_entrega_dias: 0, pedidos: [] };
    const mockAlertas = {
      projeto: { codigo: 'PRJ003', nome: 'Teste' },
      data_referencia: '2024-01-01',
      alertas_criticos: {
        pedidos_atrasados: [],
        pedidos_prioritarios_pendentes: [],
        materiais_obsoletos: [],
      },
    };

    vi.mocked(projectService.getPurchases).mockResolvedValue(mockCompras);
    vi.mocked(projectService.getCriticalAlerts).mockResolvedValue(mockAlertas);

    render(
      <MemoryRouter initialEntries={['/purchases/1']}>
        <Routes>
          <Route path="/purchases/:id" element={<TrackingDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Nenhum item encontrado')[0]).toBeInTheDocument();
    });
    // For id=1, it fetches PRJ003
    expect(projectService.getPurchases).toHaveBeenCalledWith('PRJ003');
  });

  it('fetches correct id from url params', async () => {
    const mockCompras = { projeto: 'foobar', tempo_medio_entrega_dias: 0, pedidos: [] };
    const mockAlertas = {
      projeto: { codigo: 'foobar', nome: 'Teste' },
      data_referencia: '2024-01-01',
      alertas_criticos: {
        pedidos_atrasados: [],
        pedidos_prioritarios_pendentes: [],
        materiais_obsoletos: [],
      },
    };

    vi.mocked(projectService.getPurchases).mockResolvedValue(mockCompras);
    vi.mocked(projectService.getCriticalAlerts).mockResolvedValue(mockAlertas);

    render(
      <MemoryRouter initialEntries={['/purchases/foobar']}>
        <Routes>
          <Route path="/purchases/:id" element={<TrackingDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(projectService.getPurchases).toHaveBeenCalledWith('foobar');
    });
  });

  it('uses PRJ003 as default ID if no ID is provided in route', async () => {
    const mockCompras = { projeto: 'PRJ003', tempo_medio_entrega_dias: 0, pedidos: [] };
    const mockAlertas = {
      projeto: { codigo: 'PRJ003', nome: 'Teste' },
      data_referencia: '2024-01-01',
      alertas_criticos: {
        pedidos_atrasados: [],
        pedidos_prioritarios_pendentes: [],
        materiais_obsoletos: [],
      },
    };

    vi.mocked(projectService.getPurchases).mockResolvedValue(mockCompras);
    vi.mocked(projectService.getCriticalAlerts).mockResolvedValue(mockAlertas);

    render(
      <MemoryRouter initialEntries={['/purchases']}>
        <Routes>
          <Route path="/purchases" element={<TrackingDashboard />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(projectService.getPurchases).toHaveBeenCalledWith('PRJ003');
    });
  });
});
