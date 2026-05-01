export type Material = {
  id: string;
  name: string;
  category: string;
  amount_committed: number;
  unit_cost: number;
  commitment_date: string;
  status: string;
};

export type EmpenhoMaterial = {
  codigo_material: string;
  descricao: string;
  total_custo: number;
  fornecedor: string;
  categoria?: string;
  quantidade_total?: number;
};

export type MaterialComStatus = EmpenhoMaterial & {
  isObsoleto: boolean;
};

export type MaterialObsoleto = {
  codigo_material: string;
  descricao: string;
  status: string;
  vinculado_ao_projeto: boolean;
  pedido_recente: boolean;
};

export type SolicitacaoParaProjeto = {
  numero_solicitacao: string;
  numero_pedido: string;
  data_solicitacao?: string;
  data_pedido?: string;
};

export type AlertasResponse = {
  projeto: {
    codigo: string;
    nome: string;
  };
  data_referencia: string;
  alertas_criticos: {
    pedidos_atrasados: unknown[];
    pedidos_prioritarios_pendentes: unknown[];
    materiais_obsoletos: MaterialObsoleto[];
    solicitacoes_para_projetos: SolicitacaoParaProjeto[];
  };
};

export type EmpenhoCategoria = {
  categoria: string;
  total_custo: number;
};

export type EmpenhoTempo = {
  data: string;
  total_custo: number;
  materiais?: { codigo_material: string; total_custo: number }[];
  [key: string]: string | number | { codigo_material: string; total_custo: number }[] | undefined;
};

export type EmpenhosResponse = {
  projeto: {
    codigo: string;
    nome: string;
  };
  empenho_total: number;
  empenho_por_categoria: EmpenhoCategoria[];
  empenho_por_material: EmpenhoMaterial[];
  empenho_por_tempo: EmpenhoTempo[];
};
