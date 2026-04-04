import { api } from './api';

export type projeto = {
  codigo: string;
  nome: string;
};

export type tarefa = {
  codigo: string;
  titulo: string;
  responsavel: string;
  estimativa_horas: number;
  status: string;
  total_horas_trabalhadas: number;
};

export type EvolucaoHoras = {
  [key: string]: number;
};

export const taskService = {
  async getTasks(codigo_projeto: string): Promise<tarefa[]> {
    const { data } = await api.get(`/projetos/tarefas/${codigo_projeto}`);
    return data;
  },
};
