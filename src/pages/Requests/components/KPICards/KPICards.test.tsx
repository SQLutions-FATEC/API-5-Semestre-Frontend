import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiCards } from './KPICards';

describe('KpiCards', () => {
    const mockSolicitacoes = [
        { numero_solicitacao: 'SOL-001', numero_pedido: 'PED-998', nome_material: 'Capacitor', data_solicitacao: '2026-04-10', valor_total_estimado: 966.80, status: 'Aprovada' },
        { numero_solicitacao: 'SOL-002', numero_pedido: null, nome_material: 'Sensor', data_solicitacao: '2026-04-15', valor_total_estimado: 358.30, status: 'Pendente' },
        { numero_solicitacao: 'SOL-003', numero_pedido: null, nome_material: 'Microcontrolador', data_solicitacao: '2026-03-20', valor_total_estimado: 2500.00, status: 'Pendente' },
    ];

    const mockAnalytics = {
        total_pendentes: 2,
        urgentes_criticas: [
            { numero_solicitacao: 'SOL-002', prioridade: 'Crítica', status: 'Pendente', dias_desde_criacao: 4 },
            { numero_solicitacao: 'SOL-003', prioridade: 'Alta', status: 'Pendente', dias_desde_criacao: 30 },
        ]
    };

    it('renders correctly with data', () => {
        render(<KpiCards solicitacoes={mockSolicitacoes as any} analytics={mockAnalytics as any} />);

        expect(screen.getByText('Convertidas em Pedido')).toBeInTheDocument();
        expect(screen.getByText('Solicitações Pendentes')).toBeInTheDocument();

        expect(screen.getByText('2')).toBeInTheDocument();

        expect(screen.getByText('SOL-001')).toBeInTheDocument();
        expect(screen.getByText('PED-998')).toBeInTheDocument();

        expect(screen.getByText('SOL-003')).toBeInTheDocument();
        expect(screen.getByText('Microcontrolador')).toBeInTheDocument();
        expect(screen.getByText('30 dias')).toBeInTheDocument();
    });

    it('renders correctly with empty data', () => {
        render(<KpiCards solicitacoes={[]} analytics={{ total_pendentes: 0, urgentes_criticas: [] }} />);

        expect(screen.getByText('Nenhuma conversão.')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('Nenhuma urgência pendente.')).toBeInTheDocument();
    });
});