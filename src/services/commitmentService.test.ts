import { vi, describe, it, expect } from 'vitest';
import { commitmentService } from './commitmentService';
import { api } from './api';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('commitmentService', () => {
  it('getAlerts fetches data correctly', async () => {
    const mockData = {
      projeto: { codigo: 'PRJ001', nome: 'Projeto Teste' },
      data_referencia: '2023-10-01',
      alertas_criticos: {
        pedidos_atrasados: [],
        pedidos_prioritarios_pendentes: [],
        materiais_obsoletos: [],
      },
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await commitmentService.getAlerts('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/criticos/PRJ001');
    expect(result).toEqual(mockData);
  });

  it('getAnalytics fetches data correctly', async () => {
    const mockData = {
      projeto: { codigo: 'PRJ001', nome: 'Projeto Teste' },
      empenho_total: 1000,
      empenho_por_categoria: [],
      empenho_por_material: [],
      empenho_por_tempo: [],
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await commitmentService.getAnalytics('PRJ001');
    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/empenhos/');
    expect(result).toEqual(mockData);
  });
});
