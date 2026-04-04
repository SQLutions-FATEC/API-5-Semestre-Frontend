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

type tarefaApi = {
  codigo: string;
  titulo: string;
  responsavel: string;
  estimativa?: number;
  estimativa_horas?: number;
  status: string;
  total_horas_trabalhadas: number;
};

export type EvolucaoHoras = {
  [key: string]: number;
};

const normalizeTask = (task: tarefaApi): tarefa => ({
  codigo: task.codigo,
  titulo: task.titulo,
  responsavel: task.responsavel,
  estimativa_horas: Number(task.estimativa_horas ?? task.estimativa ?? 0),
  status: task.status,
  total_horas_trabalhadas: Number(task.total_horas_trabalhadas ?? 0),
});

export const taskService = {
  async getTasks(codigo_projeto: string): Promise<tarefa[]> {
    const { data } = await api.get(`/projetos/tarefas/${codigo_projeto}`);

    if (Array.isArray(data)) {
      return data.map((task) => normalizeTask(task as tarefaApi));
    }

    if (Array.isArray(data?.tarefas)) {
      return data.tarefas.map((task: tarefaApi) => normalizeTask(task));
    }

    if (Array.isArray(data?.data)) {
      return data.data.map((task: tarefaApi) => normalizeTask(task));
    }

    if (Array.isArray(data?.results)) {
      return data.results.map((task: tarefaApi) => normalizeTask(task));
    }

    return [];
  },
};
