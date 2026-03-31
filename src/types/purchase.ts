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
}
