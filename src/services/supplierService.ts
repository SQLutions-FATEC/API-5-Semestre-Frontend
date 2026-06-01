import type { SupplierDetail, SupplierOrdersResponse } from '../types/purchase';
import { api } from './api';

export const supplierService = {
  getSupplierDetail: async (id: string | number): Promise<SupplierDetail> => {
    const response = await api.get<SupplierDetail>(`/fornecedores/${id}/`);
    return response.data;
  },

  getSupplierOrders: async (
    id: string | number,
    projectId?: string
  ): Promise<SupplierOrdersResponse> => {
    let url = `/fornecedores/${id}/pedidos/`;
    if (projectId) {
      url += `?id_projeto=${encodeURIComponent(projectId)}`;
    }
    const response = await api.get<SupplierOrdersResponse>(url);
    return response.data;
  },

  listSuppliers: async (
    filters: {
      fornecedor_nome?: string;
      fornecedor_cidade?: string;
      categoria?: string;
      programa_nome?: string;
      projeto_nome?: string;
    } = {}
  ): Promise<any[]> => {
    const response = await api.get('/fornecedores/', { params: filters });
    return response.data;
  },
};
