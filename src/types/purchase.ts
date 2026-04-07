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
  centro_custo: string;
  status: string;
  dias_previstos_entrega: number;
};

export type PurchasesResponse = {
  projeto: string;
  tempo_medio_entrega_dias: number;
  pedidos: PurchaseOrderData[];
};
