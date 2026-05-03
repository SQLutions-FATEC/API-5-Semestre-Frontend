export interface SobraDetalhe {
  projeto_origem_codigo: string;
  projeto_origem_nome: string;
  quantidade_disponivel: number;
  status_projeto_origem: string;
  localizacao_fisica: string;
}

export interface AlertaEstoqueOcioso {
  codigo_material: string;
  descricao: string;
  quantidade_solicitada_atual: number;
  sobras_detectadas: SobraDetalhe[];
  potencial_economia_estimada: number;
}

export interface ConflitoCompraAberta {
  material: string;
  pedido_compra_atual: string;
  quantidade_no_pedido: number;
  alerta: string;
  disponivel_outras_fontes: number;
}

export interface StockSobrasResponse {
  projeto_alvo: {
    codigo: string;
    nome: string;
  };
  alertas_estoque_ocioso: AlertaEstoqueOcioso[];
  conflitos_compra_aberta: ConflitoCompraAberta[];
  valor_total_material: number;
}
