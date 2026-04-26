import { vi, describe, it, expect, beforeEach } from 'vitest';
import { programService } from './programService';
import { api } from './api';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('programService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllPrograms deve buscar a lista detalhada de programas corretamente', async () => {
    const mockPrograms = [
      { 
        codigo: 'MANSUP', 
        nome: 'Programa de Manutenção',
        gerente: 'Carlos Eduardo',
        gerente_tecnico: 'Rafael Carvalho',
        status: 'Ativo'
      }
    ];

    (api.get as any).mockResolvedValueOnce({ data: mockPrograms });

    const result = await programService.getAllPrograms();

    expect(api.get).toHaveBeenCalledWith('/programas/detalhes/');
    expect(result).toEqual(mockPrograms);
    expect(result[0]).toHaveProperty('gerente');
    expect(result[0]).toHaveProperty('status');
  });

  it('deve lidar com erros de rede ao buscar programas', async () => {
    (api.get as any).mockRejectedValueOnce(new Error('Erro de conexão'));

    await expect(programService.getAllPrograms()).rejects.toThrow('Erro de conexão');
  });
});