import { api } from './api';
import type { SupplierInfo, SupplierListFilters } from '../types/purchase';

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

export const supplierService = {
  async getSuppliers(filters: SupplierListFilters = {}): Promise<SupplierInfo[]> {
    const { data } = await api.get('/fornecedores/', { params: toQueryParams(filters) });
    return Array.isArray(data) ? data.map(mapSupplier) : [];
  },
};
