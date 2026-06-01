export interface PurchaseOrder {
  id: number;
  orderNumber: string;
  issueDate: string;
  deliveryDate: string;
  leadTime: number;
  supplier: string;
  costCenter: string;
  paymentCondition: string;
  totalValue: number;
  allocatedValue: number;
  status: string;
  priority: string;
  notes: string;
  materialName?: string;
  materialStatus?: string;
}

export type PurchaseOrderData = {
  numero: string;
  emissao: string;
  previsao: string;
  fornecedor: string;
  nome_material: string;
  status: string;
  dias_previstos_entrega: number;
};

export type PurchasesResponse = {
  projeto: string;
  tempo_medio_entrega_dias: number;
  pedidos: PurchaseOrderData[];
};

export type SupplierPreviousOrder = {
  codigo_projeto: string;
  codigo_pedido: string;
  nome_material: string;
  valor_gasto: number;
  data_pedida: string;
  data_previsao: string;
};

export type SupplierOrdersItem = {
  codigo_projeto: string;
  codigo_do_pedido: string;
  nome_do_material: string;
  valor_gasto: number;
  data_pedida: string;
  data_previsao: string;
  is_atrasado: boolean;
  status: string;
};

export type SupplierOrdersResponse = {
  fornecedor: string;
  quantidade_pedidos_totais: number;
  quantidade_atrasos: number;
  pedidos: SupplierOrdersItem[];
};

export type SupplierInfo = {
  id_fornecedor?: number;
  codigo_fornecedor: string;
  nome_fornecedor: string;
  categoria: string;
  cidade: string;
  regiao?: string;
  status?: string;
  ativo?: boolean;
  total_pedidos?: number;
  total_atrasos?: number;
  pedidos_anteriores?: SupplierPreviousOrder[];
};

export type SupplierListFilters = {
  fornecedor_nome?: string;
  fornecedor_cidade?: string;
  programa_nome?: string;
  projeto_nome?: string;
  categoria?: string;
};

export type SupplierDetail = {
  id_fornecedor: number;
  codigo_fornecedor: string;
  cidade: string;
  estado: string;
  categoria: string;
  status: string;
};

export type SupplierListItem = {
  id_fornecedor: number;
  codigo_fornecedor: string;
  razao_social: string;
  cidade: string;
  categoria: string;
  status: string;
};

export type SupplierOrder = {
  codigo_projeto: string;
  codigo_do_pedido: string;
  nome_do_material: string;
  valor_gasto: number;
  data_pedida: string | null;
  data_previsao: string | null;
  is_atrasado: boolean;
  status: string;
};
