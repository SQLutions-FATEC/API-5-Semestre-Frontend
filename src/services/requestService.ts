import { api } from './api';

export const getSolicitacoes = async (projectId: string) => {
  const response = await api.get(`/projetos/${projectId}/solicitacoes/detalhes/`);
  return response.data;
};

export const getSolicitacoesAnalytics = async (projectId: string) => {
  const response = await api.get(`/projetos/${projectId}/solicitacoes/stats/`);
  return response.data;
};
