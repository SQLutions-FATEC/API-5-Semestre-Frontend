import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitmentService } from '../../services/commitmentService';
import CommitmentMaterial from './CommitmentMaterial';

// 1. Mock do Layout (para renderizar os filhos direto e ignorar lógica extra de rota)
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

// 3. Mock do Serviço de API
vi.mock('../../../services/commitmentService', () => ({
  commitmentService: {
    getAlerts: vi.fn(),
    getAnalytics: vi.fn()
  }
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
    vi.clearAllMocks();
  });

  it('deve exibir a mensagem de carregamento ao montar o componente', () => {
    vi.mocked(commitmentService.getAlerts).mockReturnValue(new Promise(() => { }));
    vi.mocked(commitmentService.getAnalytics).mockReturnValue(new Promise(() => { }));

    render(<CommitmentMaterial />);

    expect(screen.getByText('Carregando painel analítico...')).toBeDefined();
  });

  it('deve carregar os dados da API e renderizar os gráficos e a lista', async () => {
    vi.mocked(commitmentService.getAlerts).mockResolvedValue(mockAlerts as any);
    vi.mocked(commitmentService.getAnalytics).mockResolvedValue(mockAnalytics as any);

    render(<CommitmentMaterial />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    // Verificamos se as APIs foram chamadas com o ID padrão
    expect(commitmentService.getAlerts).toHaveBeenCalledWith('PRJ003');
    expect(commitmentService.getAnalytics).toHaveBeenCalledWith('PRJ003');

    // Verificamos se os subcomponentes foram montados na tela
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('obsolete-list')).toBeDefined();
  });

  it('deve remover o loading e não quebrar mesmo se a API retornar erro', async () => {
    // Simulamos um erro no backend (API caindo)
    vi.mocked(commitmentService.getAlerts).mockRejectedValue(new Error('Erro na API'));
    vi.mocked(commitmentService.getAnalytics).mockRejectedValue(new Error('Erro na API'));

    render(<CommitmentMaterial />);

    // O loading deve sumir mesmo com erro (graças ao bloco finally no useEffect)
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    // Os componentes devem renderizar (provavelmente vazios, mas a página não deve "crashar")
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('obsolete-list')).toBeDefined();
  });
});