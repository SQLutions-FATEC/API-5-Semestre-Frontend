import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiCards } from './KPICards';

describe('KpiCards', () => {
    // Padrão do projeto: mock definido localmente
    const mockRequests = [
        { id: '1', numero_solicitacao: 'SOL-001', numero_pedido: 'PED-998', nome_material: 'Capacitor', data_solicitacao: '2026-04-10', valor_total_estimado: 966.80, status: 'Aprovada', prioridade: 'Média', dias_desde_criacao: 9 },
        { id: '2', numero_solicitacao: 'SOL-002', numero_pedido: null, nome_material: 'Sensor', data_solicitacao: '2026-04-15', valor_total_estimado: 358.30, status: 'Pendente', prioridade: 'Crítica', dias_desde_criacao: 4 },
        { id: '3', numero_solicitacao: 'SOL-003', numero_pedido: null, nome_material: 'Microcontrolador', data_solicitacao: '2026-03-20', valor_total_estimado: 2500.00, status: 'Pendente', prioridade: 'Alta', dias_desde_criacao: 30 },
    ];

    it('renders correctly with data', () => {
        render(<KpiCards requests={mockRequests as any} />);

        expect(screen.getByText('Convertidas em Pedido')).toBeInTheDocument();
        expect(screen.getByText('Solicitações Pendentes')).toBeInTheDocument();

        expect(screen.getByText('2')).toBeInTheDocument(); // Duas solicitações pendentes

        expect(screen.getByText('SOL-001')).toBeInTheDocument();
        expect(screen.getByText('PED-998')).toBeInTheDocument();

        expect(screen.getByText('SOL-003')).toBeInTheDocument();
        expect(screen.getByText('Microcontrolador')).toBeInTheDocument();
        expect(screen.getByText('30 dias')).toBeInTheDocument();
    });

    it('renders correctly with empty data', () => {
        render(<KpiCards requests={[]} />);

        expect(screen.getByText('Nenhuma conversão.')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument(); // 0 pendentes
        expect(screen.getByText('Nenhuma urgência pendente.')).toBeInTheDocument();
    });
});