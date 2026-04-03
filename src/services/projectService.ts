import { api } from './api';

export type Financeiro = {
  total_horas_trabalhadas: number;
  custo_total_materiais: number;
  custo_total_projeto: number;
};

export type Projeto = {
  codigo: string;
  nome: string;
  status: string;
  data_inicio: string;
  data_fim_prevista: string;
  responsavel: string;
};

export type Programa = {
  codigo: string;
  nome: string;
  gerente: string;
};

export type ProjectOverviewResponse = {
  projeto: Projeto;
  financeiro: Financeiro;
  programa: Programa;
};

export const projectService = {
  async getOverview(codigo_projeto: string): Promise<ProjectOverviewResponse> {
    const { data } = await api.get(`/projetos/${codigo_projeto}/`);
    return data;
  }
};
