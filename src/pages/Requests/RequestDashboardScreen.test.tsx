import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getSolicitacoes, getSolicitacoesAnalytics } from '../../services/requestService';
import RequestDashboardScreen from './RequestDashboardScreen';

vi.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'PRJ003' }),
}));

vi.mock('../../../../services/solicitacaoService', () => ({
    getSolicitacoes: vi.fn(),
    getSolicitacoesAnalytics: vi.fn(),
}));

describe('RequestDashboardScreen', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the screen shell and child components correctly after loading', async () => {
        // Configuramos a API falsa para devolver arrays vazios no teste base
        (getSolicitacoes as any).mockResolvedValue({ solicitacoes: [] });
        (getSolicitacoesAnalytics as any).mockResolvedValue({ estatisticas: { total_pendentes: 0, urgentes_criticas: [] } });

        render(<RequestDashboardScreen />);

        expect(screen.getByText('Carregando dados...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Dashboard de Solicitações')).toBeInTheDocument();
        });

        expect(screen.getByText('Acompanhamento e rastreio de materiais')).toBeInTheDocument();
        expect(screen.getByText('Convertidas em Pedido')).toBeInTheDocument();
        expect(screen.getByText('Todas as Solicitações')).toBeInTheDocument();
    });

    it('renders an error message when the API fails', async () => {
        (getSolicitacoes as any).mockRejectedValue(new Error('Network Error'));
        (getSolicitacoesAnalytics as any).mockRejectedValue(new Error('Network Error'));

        render(<RequestDashboardScreen />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar os dados.')).toBeInTheDocument();
        });
    });
});