import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitmentService } from '../../services/commitmentService';
import CommitmentMaterial from './CommitmentMaterial';

vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: any) => <div data-testid="project-layout">{children(null)}</div>
}));

vi.mock('./components/CommitmentCharts/CommitmentCharts', () => ({
  default: () => <div data-testid="charts">Charts Component</div>
}));

// Agora mockamos o Tab ao invés da lista de obsoletos
vi.mock('./components/CommitmentTab/CommitmentTab', () => ({
  default: () => <div data-testid="commitment-tab">Tab Component</div>
}));

describe('CommitmentMaterial Component', () => {
  const mockAlerts = {
    alertas_criticos: {
      materiais_obsoletos: [{ codigo_material: 'MAT123', descricao: 'Cabo Teste' }]
    }
  };

  const mockAnalytics = {
    empenho_total: 1000,
    empenho_por_categoria: [{ categoria: 'Cabos', total_custo: 1000 }],
    empenho_por_tempo: [{ data: '2024-01-01', total_custo: 1000 }],
    // Adicionado para o teste não quebrar no `.map`
    empenho_por_material: [{ codigo_material: 'MAT123', descricao: 'Cabo Teste' }]
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve exibir a mensagem de carregamento ao montar o componente', () => {
    vi.spyOn(commitmentService, 'getAlerts').mockReturnValue(new Promise(() => { }));
    vi.spyOn(commitmentService, 'getAnalytics').mockReturnValue(new Promise(() => { }));

    render(<CommitmentMaterial />);

    expect(screen.getByText('Carregando painel analítico...')).toBeDefined();
  });

  it('deve carregar os dados da API e renderizar os gráficos e a tabela', async () => {
    const spyAlerts = vi.spyOn(commitmentService, 'getAlerts').mockResolvedValue(mockAlerts as any);
    const spyAnalytics = vi.spyOn(commitmentService, 'getAnalytics').mockResolvedValue(mockAnalytics as any);

    render(<CommitmentMaterial />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    expect(spyAlerts).toHaveBeenCalledWith('PRJ003');
    expect(spyAnalytics).toHaveBeenCalledWith('PRJ003');

    // Verifica abas
    expect(screen.getByText('Materiais')).toBeDefined();
    expect(screen.getByText('Tarefas')).toBeDefined();

    // Verifica os componentes filhos
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('commitment-tab')).toBeDefined();
  });

  it('deve remover o loading e não quebrar mesmo se a API retornar erro', async () => {
    vi.spyOn(commitmentService, 'getAlerts').mockRejectedValue(new Error('Erro na API'));
    vi.spyOn(commitmentService, 'getAnalytics').mockRejectedValue(new Error('Erro na API'));

    render(<CommitmentMaterial />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('commitment-tab')).toBeDefined();
  });
});