export interface ExpenseDetail {
  numero_pedido: string;
  material_nome: string;
  fornecedor_nome: string;
  valor_total_pedido: number;
  status: string;
  data_pedida?: string;
}

export interface ProjectInfo {
  codigo: string;
  nome: string;
}

export interface ExpensesDetailsResponse {
  projeto: ProjectInfo;
  gasto_total_consolidado: number;
  pedidos: ExpenseDetail[];
}

export interface ExpenseEvolution {
  data: string;
  total_gasto: number;
}

export type ExpensesEvolutionResponse = ExpenseEvolution[];
