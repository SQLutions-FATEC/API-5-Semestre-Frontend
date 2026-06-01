import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import StockScreen from './StockScreen';
import { projectService } from '../../services/projectService';
import { commitmentService } from '../../services/commitmentService';

// Mock dos serviços
vi.mock('../../services/projectService', () => ({
  projectService: {
    getStockSobras: vi.fn(),
  },
}));

vi.mock('../../services/commitmentService', () => ({
  commitmentService: {
    getAnalytics: vi.fn(),
  },
}));

// Mock do ProjectLayout
vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: { children: any }) => (
    <div className="mock-project-layout">
      {typeof children === 'function' ? children() : children}
    </div>
  ),
}));

const renderWithRouter = (ui: React.ReactElement, { route = '/projeto/PRJ001/estoque' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/projeto/:codigo_projeto/estoque" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('StockScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (projectService.getStockSobras as any).mockResolvedValue({
      alertas_estoque_ocioso: [],
      conflitos_compra_aberta: [],
      valor_total_material: 0,
    });
    (commitmentService.getAnalytics as any).mockResolvedValue({
      empenho_por_material: [],
    });
  });

  it('renders without crashing', async () => {
    const { container } = renderWithRouter(<StockScreen />);
    expect(container).toBeTruthy();
  });

  it('toggles chart type when clicking the selector', async () => {
    const { getByLabelText } = renderWithRouter(<StockScreen />);

    const selector = getByLabelText(/Alternar visualização do gráfico/i);

    expect(selector.textContent).toContain('Quantidade');

    await act(async () => {
      fireEvent.click(selector);
    });

    expect(selector.textContent).toContain('Custo');

    await act(async () => {
      fireEvent.click(selector);
    });
    expect(selector.textContent).toContain('Quantidade');
  });

  it('handles main API error gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (projectService.getStockSobras as any).mockRejectedValue(new Error('API Failure'));

    renderWithRouter(<StockScreen />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao buscar dados de estoque:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('handles analytics API error gracefully and continues', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (commitmentService.getAnalytics as any).mockRejectedValue(new Error('Analytics Failure'));

    renderWithRouter(<StockScreen />);

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Erro ao buscar analytics, usando dados vazios:',
        expect.any(Error)
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('renders the total stock value card with mocked data', async () => {
    (projectService.getStockSobras as any).mockResolvedValue({
      alertas_estoque_ocioso: [],
      conflitos_compra_aberta: [],
      valor_total_material: 1500.5,
    });

    const { getByText } = renderWithRouter(<StockScreen />);

    await waitFor(() => {
      expect(getByText(/R\$ 1\.500,50/)).toBeTruthy();
    });
  });

  it('handles null/undefined data fields from API', async () => {
    // Simula resposta com campos faltantes para testar os fallbacks (|| [] e ?.)
    (projectService.getStockSobras as any).mockResolvedValue({
      alertas_estoque_ocioso: null,
      conflitos_compra_aberta: undefined,
      valor_total_material: null,
    });
    (commitmentService.getAnalytics as any).mockResolvedValue(null);

    const { getByText } = renderWithRouter(<StockScreen />);

    await waitFor(() => {
      expect(getByText('Nenhum material restante de pedidos anteriores.')).toBeTruthy();
      expect(getByText('R$ 0,00')).toBeTruthy();
    });
  });

  it('renders alerts and materials correctly from API response', async () => {
    (projectService.getStockSobras as any).mockResolvedValue({
      alertas_estoque_ocioso: [
        {
          codigo_material: 'MAT1',
          descricao: 'Material Teste',
          sobras_detectadas: [
            {
              projeto_origem_codigo: 'PRJ_X',
              projeto_origem_nome: 'Projeto X',
              quantidade_disponivel: 100,
              status_projeto_origem: 'Concluido',
              localizacao_fisica: 'Armário B',
            },
          ],
        },
      ],
      conflitos_compra_aberta: [
        {
          material: 'Material Teste',
          pedido_compra_atual: 'PED_001',
          quantidade_no_pedido: 10,
          disponivel_outras_fontes: 100,
        },
      ],
    });

    const { getByText } = renderWithRouter(<StockScreen />);

    await waitFor(() => {
      expect(getByText(/Há 100 Material Teste do pedido PRJ_X/)).toBeTruthy();
      expect(getByText('Material Teste')).toBeTruthy();
    });

    const pedidosTab = getByText('Pedidos abertos');
    fireEvent.click(pedidosTab);

    expect(getByText(/O pedido \(PED_001\) esta pedindo o material Material Teste/)).toBeTruthy();
  });
});
