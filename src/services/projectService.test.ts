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

  it('deve chamar getPrograms e retornar a lista de programas', async () => {
    const mockPrograms = [{ codigo: 'P1', nome: 'Programa 1' }];
    (api.get as never).mockResolvedValue({ data: mockPrograms });

    const result = await projectService.getPrograms();

    expect(api.get).toHaveBeenCalledWith('/programas/');
    expect(result).toEqual(mockPrograms);
  });

  it('deve chamar getProjectsByProgram e retornar projetos filtrados', async () => {
    const mockProjects = [{ codigo: 'PRJ-1', nome: 'Projeto 1' }];
    (api.get as never).mockResolvedValue({ data: mockProjects });

    const result = await projectService.getProjectsByProgram('P1');

    expect(api.get).toHaveBeenCalledWith('/programas/P1/projetos/');
    expect(result).toEqual(mockProjects);
  });
});
