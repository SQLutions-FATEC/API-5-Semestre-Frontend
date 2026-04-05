import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitmentService } from '../../services/commitmentService';
import CommitmentMaterial from './CommitmentMaterial';

// 1. Mock do Layout
vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: any) => <div data-testid="project-layout">{children(null)}</div>
}));

// 2. Mock dos subcomponentes visuais
vi.mock('./components/CommitmentCharts/CommitmentCharts', () => ({
  default: () => <div data-testid="charts">Charts Component</div>
}));

vi.mock('./components/ObsoleteList/ObsoleteList', () => ({
  default: () => <div data-testid="obsolete-list">Obsolete List Component</div>
}));

describe('CommitmentMaterial Component', () => {
  const mockAlerts = {
    alertas_criticos: {
      materiais_obsoletos: [{ codigo_material: 'MAT123', descricao: 'Cabo Teste' }]
    }
  };

  const mockAnalytics = {
    empenho_por_categoria: [{ categoria: 'Cabos', total_custo: 1000 }],
    empenho_por_tempo: [{ data: '2024-01-01', total_custo: 1000 }]
  };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste para um não interferir no outro
    vi.restoreAllMocks();
  });

  it('deve exibir a mensagem de carregamento ao montar o componente', () => {
    // Intercepta as chamadas reais usando spyOn e simula uma promessa travada
    vi.spyOn(commitmentService, 'getAlerts').mockReturnValue(new Promise(() => { }));
    vi.spyOn(commitmentService, 'getAnalytics').mockReturnValue(new Promise(() => { }));

    render(<CommitmentMaterial />);

    expect(screen.getByText('Carregando painel analítico...')).toBeDefined();
  });

  it('deve carregar os dados da API e renderizar os gráficos e a lista', async () => {
    // Intercepta as chamadas e devolve os dados de sucesso
    const spyAlerts = vi.spyOn(commitmentService, 'getAlerts').mockResolvedValue(mockAlerts as any);
    const spyAnalytics = vi.spyOn(commitmentService, 'getAnalytics').mockResolvedValue(mockAnalytics as any);

    render(<CommitmentMaterial />);

    // Aguarda o loading sumir
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    // Verifica se as funções foram chamadas com o ID default do layout
    expect(spyAlerts).toHaveBeenCalledWith('PRJ003');
    expect(spyAnalytics).toHaveBeenCalledWith('PRJ003');

    // Verifica se os componentes renderizaram
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('obsolete-list')).toBeDefined();
  });

  it('deve remover o loading e não quebrar mesmo se a API retornar erro', async () => {
    // Intercepta as chamadas e simula uma falha na rede/backend
    vi.spyOn(commitmentService, 'getAlerts').mockRejectedValue(new Error('Erro na API'));
    vi.spyOn(commitmentService, 'getAnalytics').mockRejectedValue(new Error('Erro na API'));

    render(<CommitmentMaterial />);

    // O loading deve sumir sem explodir a tela
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('obsolete-list')).toBeDefined();
  });
});