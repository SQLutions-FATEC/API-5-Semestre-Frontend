import { api } from './api';
import type { ProjectOverviewResponse, ProgramOption, ProjectListItem } from '../types/project';
import type { PurchasesResponse } from '../types/purchase';
import type { CriticalAlertsResponse } from '../types/alerts';
import type { ExpensesDetailsResponse, ExpensesEvolutionResponse } from '../types/expenses';

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

  async getPrograms(): Promise<ProgramOption[]> {
    const { data } = await api.get('/programas/');
    return data;
  },

  async getProjectsByProgram(programId: string): Promise<ProjectListItem[]> {
    const { data } = await api.get(`/programas/${programId}/projetos/`);
    return data;
  },

  async getExpensesDetails(codigo_projeto: string): Promise<ExpensesDetailsResponse> {
    const { data } = await api.get(`/projetos/${codigo_projeto}/gastos/detalhes/`);
    return data;
  },

  async getExpensesEvolution(codigo_projeto: string): Promise<ExpensesEvolutionResponse> {
    const { data } = await api.get(`/projetos/${codigo_projeto}/gastos/evolucao/`);
    return data;
  },
};
