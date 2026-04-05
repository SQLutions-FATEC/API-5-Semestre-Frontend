import { api } from './api';
import type { ProjectOverviewResponse } from '../types/project';
import type { PurchasesResponse } from '../types/purchase';
import type { CriticalAlertsResponse } from '../types/alerts';

export const projectService = {
  async getOverview(codigo_projeto: string): Promise<ProjectOverviewResponse> {
    const { data } = await api.get(`/projetos/${codigo_projeto}/`);
    return data;
  },

  async getPurchases(codigo_projeto: string): Promise<PurchasesResponse> {
    const { data } = await api.get(`/projetos/${codigo_projeto}/compras/`);
    return data;
  },

  async getCriticalAlerts(codigo_projeto: string): Promise<CriticalAlertsResponse> {
    const { data } = await api.get(`/projetos/criticos/${codigo_projeto}`);
    return data;
  },
};
