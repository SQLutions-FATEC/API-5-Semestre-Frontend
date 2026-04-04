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

export type TaskTrackingData = {
  projeto?: projeto;
  tarefas: tarefa[];
  evolucao_horas: EvolucaoHoras;
};

const normalizeTask = (task: tarefaApi): tarefa => ({
  codigo: task.codigo,
  titulo: task.titulo,
  responsavel: task.responsavel,
  estimativa_horas: Number(task.estimativa_horas ?? task.estimativa ?? 0),
  status: task.status,
  total_horas_trabalhadas: Number(task.total_horas_trabalhadas ?? 0),
});

const normalizeEvolution = (value: unknown): EvolucaoHoras => {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce<EvolucaoHoras>(
    (acc, [date, hours]) => {
      acc[date] = Number(hours ?? 0);
      return acc;
    },
    {}
  );
};

export const taskService = {
  async getTaskTracking(codigo_projeto: string): Promise<TaskTrackingData> {
    const { data } = await api.get(`/projetos/tarefas/${codigo_projeto}`);

    if (Array.isArray(data)) {
      return {
        tarefas: data.map((task) => normalizeTask(task as tarefaApi)),
        evolucao_horas: {},
      };
    }

    let tarefas: tarefa[] = [];

    if (Array.isArray(data?.tarefas)) {
      tarefas = data.tarefas.map((task: tarefaApi) => normalizeTask(task));
    } else if (Array.isArray(data?.data)) {
      tarefas = data.data.map((task: tarefaApi) => normalizeTask(task));
    } else if (Array.isArray(data?.results)) {
      tarefas = data.results.map((task: tarefaApi) => normalizeTask(task));
    }

    return {
      projeto: data?.projeto,
      tarefas,
      evolucao_horas: normalizeEvolution(data?.evolucao_horas),
    };
  },

  async getTasks(codigo_projeto: string): Promise<tarefa[]> {
    const tracking = await this.getTaskTracking(codigo_projeto);
    return tracking.tarefas;
  },
};
