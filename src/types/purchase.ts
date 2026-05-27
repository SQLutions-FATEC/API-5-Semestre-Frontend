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

export type SupplierInfo = {
  codigo_fornecedor: string;
  nome_fornecedor: string;
  categoria: string;
  cidade: string;
  regiao: string;
  ativo: boolean;
  total_pedidos: number;
  total_atrasos: number;
  pedidos_anteriores: SupplierPreviousOrder[];
};
