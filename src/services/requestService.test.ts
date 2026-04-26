import { describe, expect, it, vi } from 'vitest';
import { api } from './api';
import { getSolicitacoes, getSolicitacoesAnalytics } from './requestService';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('solicitacaoService', () => {
  it('getSolicitacoes fetches data correctly', async () => {
    const mockData = { solicitacoes: [] };
    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getSolicitacoes('PRJ001');

    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/solicitacoes/detalhes/');
    expect(result).toEqual(mockData);
  });

  it('getSolicitacoesAnalytics fetches data correctly', async () => {
    const mockData = { estatisticas: {} };
    (api.get as any).mockResolvedValueOnce({ data: mockData });

    const result = await getSolicitacoesAnalytics('PRJ001');

    expect(api.get).toHaveBeenCalledWith('/projetos/PRJ001/solicitacoes/stats/');
    expect(result).toEqual(mockData);
  });
});
