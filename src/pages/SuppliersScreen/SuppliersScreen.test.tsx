import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supplierService } from '../../services/supplierService';
import SuppliersScreen from './SuppliersScreen';

// Mock do ProjectLayout para evitar problemas com dependências internas dele
vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: { children: any }) => (
    <div data-testid="mock-project-layout">
      {typeof children === 'function' ? children() : children}
    </div>
  ),
}));

// Mock atualizado: Agora inclui os métodos do Modal para não quebrar no clique do card
vi.mock('../../services/supplierService', () => ({
  supplierService: {
    listSuppliers: vi.fn(),
    getSupplierDetail: vi.fn(),
    getSupplierOrders: vi.fn(),
  },
}));

const mockedListSuppliers = vi.mocked(supplierService.listSuppliers);
const mockedGetDetail = vi.mocked(supplierService.getSupplierDetail);
const mockedGetOrders = vi.mocked(supplierService.getSupplierOrders);

const suppliers = [
  {
    id_fornecedor: 1,
    codigo_fornecedor: 'F001',
    razao_social: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    status: 'Ativo',
    ativo: true,
  },
  {
    id_fornecedor: 2,
    codigo_fornecedor: 'F002',
    razao_social: 'Tech Corp Eletrônicos',
    categoria: 'Eletrônica',
    cidade: 'São Paulo',
    status: 'Inativo',
    ativo: false,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockedListSuppliers.mockResolvedValue(suppliers as never);

  // Retornos vazios apenas para o modal não quebrar ao ser aberto no teste
  mockedGetDetail.mockResolvedValue({} as never);
  mockedGetOrders.mockResolvedValue({ pedidos: [] } as never);
});

const renderWithRouter = (
  ui: React.ReactElement,
  { route = '/programas/PRG1/projetos/PRJ1/fornecedores' } = {}
) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/programas/:programa_cod/projetos/:codigo_projeto/fornecedores" element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

describe('SuppliersScreen', () => {
  it('renders and loads suppliers from the backend', async () => {
    renderWithRouter(<SuppliersScreen />);

    expect(screen.getByText('Fornecedores')).toBeTruthy();

    await waitFor(() =>
      expect(mockedListSuppliers).toHaveBeenCalledWith({
        fornecedor_nome: '',
        fornecedor_cidade: '',
        programa_nome: '',
        projeto_nome: '',
        categoria: '',
      })
    );
    expect(await screen.findByText('RTech Distribuidora 1 Ltda')).toBeTruthy();
  });

  it('sends the typed filters to the backend when applying filters', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SuppliersScreen />);

    await screen.findByText('RTech Distribuidora 1 Ltda');

    // Usando user.type para garantir que o estado do React atualize corretamente
    await user.type(screen.getByPlaceholderText('Pesquisar fornecedores...'), 'RTech');
    await user.type(screen.getByPlaceholderText('Filtrar por categorias...'), 'Solda');
    await user.type(screen.getByPlaceholderText('Filtrar por cidades...'), 'Jundiaí');
    await user.type(screen.getByPlaceholderText('Filtrar por programas...'), 'Programa Alfa');
    await user.type(screen.getByPlaceholderText('Filtrar por projetos...'), 'Projeto X');

    await user.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    await waitFor(() => {
      expect(mockedListSuppliers).toHaveBeenLastCalledWith({
        fornecedor_nome: 'RTech',
        categoria: 'Solda',
        fornecedor_cidade: 'Jundiaí',
        programa_nome: 'Programa Alfa',
        projeto_nome: 'Projeto X',
      });
    });
  });

  it('opens the supplier modal when a card is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<SuppliersScreen />);

    const supplierCard = await screen.findByRole('button', {
      name: 'Ver detalhes do fornecedor RTech Distribuidora 1 Ltda',
    });

    await user.click(supplierCard);

    // Como mockamos o modal, ele deve abrir sem erros agora
    expect(await screen.findByRole('dialog', { hidden: true })).toBeTruthy();
  });
});
