import { api } from './api';
import type { AlertasResponse, EmpenhosResponse } from '../types/commitment';

export const commitmentService = {
  async getAlerts(codigo_projeto: string): Promise<AlertasResponse> {
    const { data } = await api.get<AlertasResponse>(`/projetos/criticos/${codigo_projeto}`);
    return data;
  },

  async getAnalytics(codigo_projeto: string): Promise<EmpenhosResponse> {
    const { data } = await api.get<EmpenhosResponse>(`/projetos/${codigo_projeto}/empenhos/`);
    return data;
  },
};
