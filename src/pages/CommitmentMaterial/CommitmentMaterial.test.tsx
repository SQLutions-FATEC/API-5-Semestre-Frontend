import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { commitmentService } from '../../services/commitmentService';
import CommitmentMaterial from './CommitmentMaterial';

// Mock dos componentes filhos para isolar o teste do pai
vi.mock('./components/CommitmentCharts/CommitmentCharts', () => ({
  default: () => <div data-testid="charts">Charts Component</div>,
}));

vi.mock('./components/CommitmentTab/CommitmentTab', () => ({
  default: ({ data }: any) => (
    <div data-testid="commitment-tab">Tab Component - Itens: {data?.length}</div>
  ),
}));

describe('CommitmentMaterial Component', () => {
  const idProjeto = 'PRJ003';

  const mockAlerts = {
    alertas_criticos: {
      materiais_obsoletos: [{ codigo_material: 'MAT123', descricao: 'Cabo Teste' }],
    },
  };

  const mockAnalytics = {
    empenho_total: 1000,
    empenho_por_categoria: [{ categoria: 'Cabos', total_custo: 1000 }],
    empenho_por_tempo: [{ data: '2024-01-01', total_custo: 1000 }],
    // Estrutura essencial para o .map do componente não quebrar
    empenho_por_material: [
      {
        codigo_material: 'MAT123',
        descricao: 'Cabo Teste',
        total_custo: 1000,
        fornecedor: 'Fornecedor A',
      },
      { codigo_material: 'MAT456', descricao: 'Outro Material', total_custo: 500 },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve exibir a mensagem de carregamento ao montar o componente', () => {
    // Definimos promises que nunca resolvem para testar o estado de loading
    vi.spyOn(commitmentService, 'getAlerts').mockReturnValue(new Promise(() => {}));
    vi.spyOn(commitmentService, 'getAnalytics').mockReturnValue(new Promise(() => {}));

    render(<CommitmentMaterial />);

    expect(screen.getByText('Carregando painel analítico...')).toBeDefined();
  });

  it('deve carregar os dados da API e renderizar os gráficos e a tabela', async () => {
    const spyAlerts = vi.spyOn(commitmentService, 'getAlerts').mockResolvedValue(mockAlerts as any);
    const spyAnalytics = vi
      .spyOn(commitmentService, 'getAnalytics')
      .mockResolvedValue(mockAnalytics as any);

    render(<CommitmentMaterial />);

    // Aguarda o loading sumir
    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    // Verifica se as chamadas de API foram feitas com o ID correto
    expect(spyAlerts).toHaveBeenCalledWith(idProjeto);
    expect(spyAnalytics).toHaveBeenCalledWith(idProjeto);

    // Verifica se os componentes filhos foram renderizados
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('commitment-tab')).toBeDefined();

    // Verifica se os dados chegaram à tabela (2 itens no mockAnalytics)
    expect(screen.getByText(/Itens: 2/)).toBeDefined();
  });

  it('deve remover o loading e exibir os componentes mesmo se a API retornar erro', async () => {
    // Silencia o console.error para não poluir o terminal de testes
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.spyOn(commitmentService, 'getAlerts').mockRejectedValue(new Error('Erro na API'));
    vi.spyOn(commitmentService, 'getAnalytics').mockRejectedValue(new Error('Erro na API'));

    render(<CommitmentMaterial />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando painel analítico...')).toBeNull();
    });

    // Mesmo em erro, o componente renderiza o layout (com dados vazios)
    expect(screen.getByTestId('charts')).toBeDefined();
    expect(screen.getByTestId('commitment-tab')).toBeDefined();
  });
});
