import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SupplierInfoModal from './SupplierInfoModal';
import type { SupplierInfo } from '../../../../types/purchase';

// ─── Mock data ───────────────────────────────────────────────────────────────

const mockSupplierBase: SupplierInfo = {
  codigo_fornecedor: 'FOR001',
  nome_fornecedor: 'RTech Distribuidora 1 Ltda',
  categoria: 'Materiais de Solda',
  cidade: 'Jundiaí',
  regiao: 'SP',
  ativo: true,
  total_pedidos: 5,
  total_atrasos: 2,
  pedidos_anteriores: [
    {
      codigo_projeto: 'PRJ001',
      codigo_pedido: 'PC0001',
      nome_material: 'Capacitor Cerâmico 10uF 0603',
      valor_gasto: 16532.28,
      data_pedida: '2024-11-12',
      data_previsao: '2024-12-21',
    },
    {
      codigo_projeto: 'PRJ002',
      codigo_pedido: 'PC0002',
      nome_material: 'Capacitor Cerâmico 10uF 0604',
      valor_gasto: 2687.16,
      data_pedida: '2022-08-24',
      data_previsao: '2022-09-19',
    },
    {
      codigo_projeto: 'PRJ003',
      codigo_pedido: 'PC0003',
      nome_material: 'Capacitor Cerâmico 1nF 0402',
      valor_gasto: 278.64,
      data_pedida: '2022-04-14',
      data_previsao: '2022-05-27',
    },
  ],
};

const mockOnClose = vi.fn();

// ─── Helpers ─────────────────────────────────────────────────────────────────

const renderModal = (supplier: SupplierInfo = mockSupplierBase) =>
  render(<SupplierInfoModal supplier={supplier} onClose={mockOnClose} />);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('SupplierInfoModal', () => {
  beforeEach(() => {
    mockOnClose.mockReset();
  });

  // --- Rendering ---

  it('renders supplier name and code', () => {
    renderModal();
    expect(screen.getByText('RTech Distribuidora 1 Ltda')).toBeInTheDocument();
    expect(screen.getByText('FOR001')).toBeInTheDocument();
  });

  it('renders supplier category', () => {
    renderModal();
    expect(screen.getByText('Materiais de Solda')).toBeInTheDocument();
  });

  it('renders supplier city and region', () => {
    renderModal();
    expect(screen.getByText(/Jundiaí/)).toBeInTheDocument();
    expect(screen.getByText(/SP/)).toBeInTheDocument();
  });

  it('renders total orders count', () => {
    renderModal();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders total delays count', () => {
    renderModal();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders all previous orders rows', () => {
    renderModal();
    expect(screen.getByText('PC0001')).toBeInTheDocument();
    expect(screen.getByText('PC0002')).toBeInTheDocument();
    expect(screen.getByText('PC0003')).toBeInTheDocument();
  });

  // --- Status dot ---

  it('renders active status dot when supplier is active', () => {
    renderModal();
    const dot = screen.getByLabelText('Fornecedor ativo');
    expect(dot).toHaveClass('supplier-modal__status-dot--active');
  });

  it('renders inactive status dot when supplier is inactive', () => {
    renderModal({ ...mockSupplierBase, ativo: false });
    const dot = screen.getByLabelText('Fornecedor inativo');
    expect(dot).toHaveClass('supplier-modal__status-dot--inactive');
  });

  // --- Reliability icon ---

  it('shows check icon when delay rate is below 20%', () => {
    renderModal({ ...mockSupplierBase, total_pedidos: 10, total_atrasos: 1 });
    expect(screen.getByLabelText('Fornecedor confiável')).toBeInTheDocument();
  });

  it('shows warning icon when delay rate is between 20% and 40%', () => {
    renderModal({ ...mockSupplierBase, total_pedidos: 10, total_atrasos: 3 });
    expect(screen.getByLabelText('Fornecedor com atrasos moderados')).toBeInTheDocument();
  });

  it('shows danger icon when delay rate is 40% or more', () => {
    renderModal({ ...mockSupplierBase, total_pedidos: 10, total_atrasos: 4 });
    expect(screen.getByLabelText('Fornecedor com alta taxa de atraso')).toBeInTheDocument();
  });

  it('shows check icon when supplier has zero orders', () => {
    renderModal({ ...mockSupplierBase, total_pedidos: 0, total_atrasos: 0 });
    expect(screen.getByLabelText('Fornecedor confiável')).toBeInTheDocument();
  });

  // --- Close ---

  it('calls onClose when close button is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByLabelText('Fechar modal'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    renderModal();
    fireEvent.click(screen.getByRole('presentation'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // --- Search filter ---

  it('filters orders by material name via search', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Buscar pedido ou material...');
    fireEvent.change(input, { target: { value: '1nF' } });

    expect(screen.getByText('PC0003')).toBeInTheDocument();
    expect(screen.queryByText('PC0001')).not.toBeInTheDocument();
    expect(screen.queryByText('PC0002')).not.toBeInTheDocument();
  });

  it('filters orders by order code via search', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Buscar pedido ou material...');
    fireEvent.change(input, { target: { value: 'PC0002' } });

    expect(screen.getByText('PC0002')).toBeInTheDocument();
    expect(screen.queryByText('PC0001')).not.toBeInTheDocument();
  });

  it('filters orders by project code via search', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Buscar pedido ou material...');
    fireEvent.change(input, { target: { value: 'PRJ001' } });

    expect(screen.getByText('PC0001')).toBeInTheDocument();
    expect(screen.queryByText('PC0002')).not.toBeInTheDocument();
  });

  it('shows empty message when search yields no results', () => {
    renderModal();
    const input = screen.getByPlaceholderText('Buscar pedido ou material...');
    fireEvent.change(input, { target: { value: 'xyzxyzxyz' } });

    expect(screen.getByText('Nenhum pedido encontrado')).toBeInTheDocument();
  });

  // --- Project dropdown filter ---

  it('filters orders by project via dropdown', () => {
    renderModal();
    const select = screen.getByLabelText('Filtrar por projeto');
    fireEvent.change(select, { target: { value: 'PRJ002' } });

    expect(screen.getByText('PC0002')).toBeInTheDocument();
    expect(screen.queryByText('PC0001')).not.toBeInTheDocument();
    expect(screen.queryByText('PC0003')).not.toBeInTheDocument();
  });

  it('shows all orders when dropdown is reset to empty', () => {
    renderModal();
    const select = screen.getByLabelText('Filtrar por projeto');
    fireEvent.change(select, { target: { value: 'PRJ001' } });
    fireEvent.change(select, { target: { value: '' } });

    expect(screen.getByText('PC0001')).toBeInTheDocument();
    expect(screen.getByText('PC0002')).toBeInTheDocument();
    expect(screen.getByText('PC0003')).toBeInTheDocument();
  });

  // --- Combined filters ---

  it('applies search and dropdown filter simultaneously', () => {
    renderModal();
    const select = screen.getByLabelText('Filtrar por projeto');
    fireEvent.change(select, { target: { value: 'PRJ001' } });

    const input = screen.getByPlaceholderText('Buscar pedido ou material...');
    fireEvent.change(input, { target: { value: '10uF' } });

    expect(screen.getByText('PC0001')).toBeInTheDocument();
    expect(screen.queryByText('PC0002')).not.toBeInTheDocument();
  });
});

