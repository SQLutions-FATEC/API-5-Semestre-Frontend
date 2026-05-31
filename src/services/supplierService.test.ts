import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './api';
import { supplierService } from './supplierService';

vi.mock('./api', () => ({
    api: {
        get: vi.fn(),
    },
}));

describe('supplierService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getSupplierDetail should fetch and return supplier details correctly', async () => {
        const mockData = {
            id_fornecedor: 1,
            codigo_fornecedor: 'FORN-01',
            cidade: 'São Paulo',
            estado: 'SP',
            categoria: 'Metalurgia',
            status: 'Ativo',
        };
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

        const result = await supplierService.getSupplierDetail(1);

        expect(api.get).toHaveBeenCalledWith('/fornecedores/1/');
        expect(result.codigo_fornecedor).toBe('FORN-01');
        expect(result.cidade).toBe('São Paulo');
    });

    it('getSupplierOrders should fetch orders without projectId correctly', async () => {
        const mockData = {
            fornecedor: 'Fornecedor Alfa',
            quantidade_pedidos_totais: 5,
            quantidade_atrasos: 1,
            pedidos: [],
        };
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

        const result = await supplierService.getSupplierOrders(123);

        expect(api.get).toHaveBeenCalledWith('/fornecedores/123/pedidos/');
        expect(result.quantidade_pedidos_totais).toBe(5);
        expect(result.fornecedor).toBe('Fornecedor Alfa');
    });

    it('getSupplierOrders should append projectId to URL when provided', async () => {
        const mockData = {
            fornecedor: 'Fornecedor Beta',
            quantidade_pedidos_totais: 2,
            quantidade_atrasos: 0,
            pedidos: [],
        };
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

        const result = await supplierService.getSupplierOrders(123, 'PRJ-001');

        // Verifica se fez o encode e montou a URL corretamente
        expect(api.get).toHaveBeenCalledWith('/fornecedores/123/pedidos/?id_projeto=PRJ-001');
        expect(result.fornecedor).toBe('Fornecedor Beta');
    });

    it('getSupplierOrders should encode special characters in projectId', async () => {
        vi.mocked(api.get).mockResolvedValueOnce({ data: {} });

        await supplierService.getSupplierOrders(123, 'PRJ 002/A');

        expect(api.get).toHaveBeenCalledWith('/fornecedores/123/pedidos/?id_projeto=PRJ%20002%2FA');
    });

    it('listSuppliers should call api with empty params by default', async () => {
        const mockData = [
            { id_fornecedor: 1, codigo_fornecedor: 'FORN-01', razao_social: 'Alfa Ltda' },
        ];
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

        const result = await supplierService.listSuppliers();

        expect(api.get).toHaveBeenCalledWith('/fornecedores/', { params: {} });
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].razao_social).toBe('Alfa Ltda');
    });

    it('listSuppliers should call api with provided filters', async () => {
        const mockData = [
            { id_fornecedor: 2, codigo_fornecedor: 'FORN-02', razao_social: 'Beta S.A' },
        ];
        vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

        const filters = {
            fornecedor_cidade: 'Campinas',
            categoria: 'Usina',
        };

        const result = await supplierService.listSuppliers(filters);

        expect(api.get).toHaveBeenCalledWith('/fornecedores/', { params: filters });
        expect(result[0].codigo_fornecedor).toBe('FORN-02');
    });
});