import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import RequestDashboardScreen from './RequestDashboardScreen';
import { getSolicitacoes, getSolicitacoesAnalytics } from '../../services/requestService';

vi.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'PRJ003' }),
}));

vi.mock('../../services/requestService');

describe('RequestDashboardScreen', () => {
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the screen shell and child components correctly after loading', async () => {
        vi.mocked(getSolicitacoes).mockResolvedValue({ solicitacoes: [] });
        vi.mocked(getSolicitacoesAnalytics).mockResolvedValue({ estatisticas: { total_pendentes: 0, urgentes_criticas: [] } });

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
        vi.mocked(getSolicitacoes).mockRejectedValue(new Error('Network Error'));
        vi.mocked(getSolicitacoesAnalytics).mockRejectedValue(new Error('Network Error'));

        render(<RequestDashboardScreen />);

        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar os dados.')).toBeInTheDocument();
        });
    });
});