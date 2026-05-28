import { api } from './api';
import type {
  SupplierInfo,
  SupplierListFilters,
  SupplierOrdersResponse,
  SupplierPreviousOrder,
} from '../types/purchase';

type SupplierApiItem = {
  id_fornecedor: number;
  codigo_fornecedor: string;
  razao_social: string;
  cidade: string;
  categoria: string;
  status: string;
};

const toQueryParams = (filters: SupplierListFilters) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, value]) => typeof value === 'string' && value.trim() !== '')
  );

const mapSupplier = (supplier: SupplierApiItem): SupplierInfo => ({
  id_fornecedor: supplier.id_fornecedor,
  codigo_fornecedor: supplier.codigo_fornecedor,
  nome_fornecedor: supplier.razao_social,
  categoria: supplier.categoria,
  cidade: supplier.cidade,
  status: supplier.status,
  ativo: supplier.status.toLowerCase() === 'ativo',
});

const mapSupplierOrder = (
  order: SupplierOrdersResponse['pedidos'][number]
): SupplierPreviousOrder => ({
  codigo_projeto: order.codigo_projeto,
  codigo_pedido: order.codigo_do_pedido,
  nome_material: order.nome_do_material,
  valor_gasto: order.valor_gasto,
  data_pedida: order.data_pedida,
  data_previsao: order.data_previsao,
});

export const supplierService = {
  async getSuppliers(filters: SupplierListFilters = {}): Promise<SupplierInfo[]> {
    const { data } = await api.get('/fornecedores/', { params: toQueryParams(filters) });
    return Array.isArray(data) ? data.map(mapSupplier) : [];
  },

  async getSupplierOrders(codigoFornecedor: string): Promise<{
    fornecedor: string;
    quantidade_pedidos_totais: number;
    quantidade_atrasos: number;
    pedidos: SupplierPreviousOrder[];
  }> {
    const { data } = await api.get(`/fornecedores/${codigoFornecedor}/pedidos/`);

    const response = data as SupplierOrdersResponse;

    return {
      fornecedor: response.fornecedor,
      quantidade_pedidos_totais: response.quantidade_pedidos_totais,
      quantidade_atrasos: response.quantidade_atrasos,
      pedidos: Array.isArray(response.pedidos) ? response.pedidos.map(mapSupplierOrder) : [],
    };
  },
};
