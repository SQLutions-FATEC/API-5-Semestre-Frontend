export interface Solicitacao {
  numero_solicitacao: string;
  numero_pedido: string | null;
  nome_material: string;
  data_solicitacao: string | null;
  valor_total_estimado: number;
  status: string;
}

export interface SolicitacaoCritica {
  numero_solicitacao: string;
  prioridade: string;
  status: string;
  dias_desde_criacao: number;
}

export interface RequestAnalytics {
  total_pendentes: number;
  urgentes_criticas: SolicitacaoCritica[];
}
