import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supplierService } from '../../../../services/supplierService';
import type {
  SupplierDetail,
  SupplierOrdersResponse
} from '../../../../types/purchase';
import SupplierInfoModal from './SupplierInfoModal';

// Mock do serviço
vi.mock('../../../../services/supplierService', () => ({
  supplierService: {
    getSupplierDetail: vi.fn(),
    getSupplierOrders: vi.fn(),
  },
}));

// ─────────────────────────────────────────
// Mocks Tipados (Corrigidos)
// ─────────────────────────────────────────

const mockSupplierDetail: SupplierDetail = {
  id_fornecedor: 99, // <- Adicionado para satisfazer SupplierDetail
  codigo_fornecedor: 'FORN-99',
  status: 'Ativo',
  categoria: 'Metalurgia',
  cidade: 'São Paulo',
  estado: 'SP',
};

const mockSupplierOrders: SupplierOrdersResponse = {
  fornecedor: 'Fornecedor Alfa',
  quantidade_pedidos_totais: 2,
  quantidade_atrasos: 0,
  pedidos: [
    {
      codigo_projeto: 'PRJ-001',
      codigo_do_pedido: 'PED-123',
      nome_do_material: 'Tubo de Aço',
      valor_gasto: 1500.50,
      data_pedida: '2026-01-10T00:00:00Z',
      data_previsao: '2026-01-20T00:00:00Z',
      is_atrasado: false,
      status: 'Entregue' // <- Adicionado para satisfazer SupplierOrder
    },
    {
      codigo_projeto: 'PRJ-002',
      codigo_do_pedido: 'PED-456',
      nome_do_material: 'Viga de Ferro',
      valor_gasto: 3000.00,
      data_pedida: '2026-02-15T00:00:00Z',
      data_previsao: '2026-02-25T00:00:00Z',
      is_atrasado: true,
      status: 'Atrasado' // <- Adicionado para satisfazer SupplierOrder
    }
  ],
};

// ─────────────────────────────────────────
// Suite de Testes
// ─────────────────────────────────────────

describe('SupplierInfoModal Component', () => {
  const mockOnClose = vi.fn();
  const supplierId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
    // Configuração padrão das respostas da API mockadas
    vi.mocked(supplierService.getSupplierDetail).mockResolvedValue(mockSupplierDetail);
    vi.mocked(supplierService.getSupplierOrders).mockResolvedValue(mockSupplierOrders);
  });

  it('deve exibir a mensagem de carregamento inicialmente', () => {
    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);
    expect(screen.getByText(/Carregando dados do fornecedor.../i)).toBeInTheDocument();
  });

  it('deve renderizar os dados do fornecedor e pedidos após o carregamento', async () => {
    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText('Fornecedor Alfa')).toBeInTheDocument();
    });

    expect(screen.getByText('FORN-99')).toBeInTheDocument();
    expect(screen.getByText('Metalurgia')).toBeInTheDocument();
    expect(screen.getByText(/São Paulo/)).toBeInTheDocument();
    expect(screen.getByText('SP')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.500,50')).toBeInTheDocument();
  });

  it('deve filtrar a tabela localmente por código do pedido ou material', async () => {
    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);
    await screen.findByText('Fornecedor Alfa');

    const localSearchInput = screen.getByPlaceholderText('Buscar pedido ou material...');

    await userEvent.type(localSearchInput, 'Tubo');

    expect(screen.getByText('Tubo de Aço')).toBeInTheDocument();
    expect(screen.queryByText('Viga de Ferro')).not.toBeInTheDocument();
  });

  it('deve disparar uma nova chamada de API após o debounce ao digitar no filtro de projeto', async () => {
    vi.useFakeTimers();

    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);
    await screen.findByText('Fornecedor Alfa');

    const projectInput = screen.getByPlaceholderText('Ex: PRJ-001...');

    await userEvent.type(projectInput, 'PRJ-XYZ');

    expect(supplierService.getSupplierOrders).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(500);

    expect(supplierService.getSupplierOrders).toHaveBeenCalledWith(supplierId, 'PRJ-XYZ');

    vi.useRealTimers();
  });

  it('deve chamar onClose ao clicar no botão fechar', async () => {
    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);
    await screen.findByText('Fornecedor Alfa');

    const closeBtn = screen.getByRole('button', { name: /Fechar modal/i });
    await userEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao pressionar a tecla Escape no backdrop', async () => {
    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);
    await screen.findByText('Fornecedor Alfa');

    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.keyDown(backdrop, { key: 'Escape', code: 'Escape' });
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve exibir o ícone de Atenção se o fornecedor tiver taxa de sucesso intermediária', async () => {
    // Usando a tipagem correta para o novo mock derivado também
    const mockWarningOrders: SupplierOrdersResponse = {
      ...mockSupplierOrders,
      quantidade_pedidos_totais: 4,
      quantidade_atrasos: 2,
    };
    vi.mocked(supplierService.getSupplierOrders).mockResolvedValueOnce(mockWarningOrders);

    render(<SupplierInfoModal supplierId={supplierId} onClose={mockOnClose} />);

    expect(await screen.findByLabelText('Atenção')).toBeInTheDocument();
  });
});