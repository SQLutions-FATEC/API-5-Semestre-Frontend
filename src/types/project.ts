export type Financeiro = {
  total_horas_trabalhadas: number;
  custo_total_materiais: number;
  custo_total_projeto: number;
  horas_totais_estimadas: number;
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

export type ProjectListItem = {
  codigo: string;
  nome: string;
  responsavel: string;
  status: 'Ativo' | 'Concluído' | 'Atrasado' | 'Suspenso'; //exemplo de status
};

export type ProgramOption = {
  codigo: string;
  nome: string;
};
