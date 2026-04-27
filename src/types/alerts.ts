export type PedidoAtrasado = {
  numero_pedido: string;
  status: string;
  data_previsao_entrega: string;
  dias_atraso: number;
};

export type PedidoPrioritario = {
  numero_pedido: string;
  prioridade: string;
  status: string;
  data_pedido: string;
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

export type CriticalAlertsResponse = {
  projeto: { codigo: string; nome: string };
  data_referencia: string;
  alertas_criticos: {
    pedidos_atrasados: PedidoAtrasado[];
    pedidos_prioritarios_pendentes: PedidoPrioritario[];
    materiais_obsoletos: MaterialObsoleto[];
    solicitacoes_para_projetos: SolicitacaoParaProjeto[];
  };
};