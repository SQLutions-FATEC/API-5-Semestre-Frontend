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
  }
}));

describe('TrackingDashboard', () => {
  it('renders loading state initially', () => {
    (projectService.getPurchases as any).mockImplementation(() => new Promise(() => {}));
    (projectService.getCriticalAlerts as any).mockImplementation(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <TrackingDashboard />
      </MemoryRouter>
    );
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state on API failure', async () => {
    (projectService.getPurchases as any).mockRejectedValue(new Error('API error'));
    (projectService.getCriticalAlerts as any).mockRejectedValue(new Error('API error'));
    
    render(
      <MemoryRouter>
        <TrackingDashboard />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Não foi possível carregar as informações de acompanhamento.')).toBeInTheDocument();
    });
  });

  it('renders the dashboard components on successful data fetch', async () => {
    const mockCompras = { pedidos: [] };
    const mockAlertas = { alertas_criticos: { pedidos_atrasados: [], pedidos_prioritarios_pendentes: [] } };
    
    (projectService.getPurchases as any).mockResolvedValue(mockCompras);
    (projectService.getCriticalAlerts as any).mockResolvedValue(mockAlertas);
    
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
    const mockCompras = { pedidos: [] };
    const mockAlertas = { alertas_criticos: { pedidos_atrasados: [], pedidos_prioritarios_pendentes: [] } };
    
    (projectService.getPurchases as any).mockResolvedValue(mockCompras);
    (projectService.getCriticalAlerts as any).mockResolvedValue(mockAlertas);
    
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
    const mockCompras = { pedidos: [] };
    const mockAlertas = { alertas_criticos: { pedidos_atrasados: [], pedidos_prioritarios_pendentes: [] } };
    
    (projectService.getPurchases as any).mockResolvedValue(mockCompras);
    (projectService.getCriticalAlerts as any).mockResolvedValue(mockAlertas);
    
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
