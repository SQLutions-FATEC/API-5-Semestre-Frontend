import { vi, describe, it, expect } from 'vitest';
import { projectService } from './projectService';
import { api } from './api';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('projectService', () => {
  it('getOverview fetches data correctly', async () => {
    const mockData = { id: 'PRJ001' };
    (api.get as any).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getOverview('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/');
    expect(result).toEqual(mockData);
  });

  it('getPurchases fetches data correctly', async () => {
    const mockData = { pedidos: [] };
    (api.get as any).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getPurchases('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/compras/');
    expect(result).toEqual(mockData);
  });

  it('getCriticalAlerts fetches data correctly', async () => {
    const mockData = { alertas_criticos: {} };
    (api.get as any).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getCriticalAlerts('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/criticos/PRJ001');
    expect(result).toEqual(mockData);
  });
});
