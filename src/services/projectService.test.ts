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
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getOverview('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/');
    expect(result).toEqual(mockData);
  });

  it('getPurchases fetches data correctly', async () => {
    const mockData = { pedidos: [] };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getPurchases('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/compras/');
    expect(result).toEqual(mockData);
  });

  it('getCriticalAlerts fetches data correctly', async () => {
    const mockData = { alertas_criticos: {} };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await projectService.getCriticalAlerts('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/criticos/PRJ001');
    expect(result).toEqual(mockData);
  });

  it('deve chamar getPrograms e retornar a lista de programas', async () => {
    const mockPrograms = { programas: [{ codigo_programa: 'P1', nome_programa: 'Programa 1' }] };
    const expected = [{ codigo: 'P1', nome: 'Programa 1' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockPrograms });

    const result = await projectService.getPrograms();

    expect(api.get).toHaveBeenCalledWith('/programas/busca/');
    expect(result).toEqual(expected);
  });

  it('deve chamar getProjectsByProgram e retornar projetos filtrados', async () => {
    const mockProjects = [
      { codigo_projeto: 'PRJ-1', nome_projeto: 'Projeto 1', responsavel: 'João', status: 'Ativo' },
    ];
    const expected = [{ codigo: 'PRJ-1', nome: 'Projeto 1', responsavel: 'João', status: 'Ativo' }];
    vi.mocked(api.get).mockResolvedValue({ data: mockProjects });

    const result = await projectService.getProjectsByProgram('P1');

    expect(api.get).toHaveBeenCalledWith('/P1/projetos/busca/', { params: {} });
    expect(result).toEqual(expected);
  });
});
