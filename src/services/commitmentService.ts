import { api } from './api';

export type MaterialObsoleto = {
    codigo_material: string;
    descricao: string;
    status: string;
    vinculado_ao_projeto: boolean;
    pedido_recente: boolean;
};

export type AlertasResponse = {
    projeto: {
        codigo: string;
        nome: string;
    };
    data_referencia: string;
    alertas_criticos: {
        pedidos_atrasados: any[];
        pedidos_prioritarios_pendentes: any[];
        materiais_obsoletos: MaterialObsoleto[];
    };
};

export type EmpenhoCategoria = {
    categoria: string;
    total_custo: number;
};

export type EmpenhoTempo = {
    data: string;
    total_custo: number;
    materiais: any[];
};

export type EmpenhosResponse = {
    projeto: {
        codigo: string;
        nome: string;
    };
    empenho_total: number;
    empenho_por_categoria: EmpenhoCategoria[];
    empenho_por_material: any[];
    empenho_por_tempo: EmpenhoTempo[];
};

export const commitmentService = {
    async getAlerts(codigo_projeto: string): Promise<AlertasResponse> {
        const { data } = await api.get(`/projetos/criticos/${codigo_projeto}`);
        return data;
    },

    async getAnalytics(codigo_projeto: string): Promise<EmpenhosResponse> {
        const { data } = await api.get(`/projetos/${codigo_projeto}/empenhos/`);
        return data;
    }
};