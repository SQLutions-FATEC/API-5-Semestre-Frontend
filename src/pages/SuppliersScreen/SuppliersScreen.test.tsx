import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SuppliersScreen from './SuppliersScreen';
import { supplierService } from '../../services/supplierService';

// Mock do ProjectLayout para evitar problemas com dependências internas dele
vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: { children: any }) => (
    <div data-testid="mock-project-layout">
      {typeof children === 'function' ? children() : children}
    </div>
  ),
}));

vi.mock('../../services/supplierService', () => ({
  supplierService: {
    getSuppliers: vi.fn(),
  },
}));

const mockedGetSuppliers = vi.mocked(supplierService.getSuppliers);

const suppliers = [
  {
    id_fornecedor: 1,
    codigo_fornecedor: 'F001',
    nome_fornecedor: 'RTech Distribuidora 1 Ltda',
    categoria: 'Materiais de Solda',
    cidade: 'Jundiaí',
    status: 'Ativo',
    ativo: true,
  },
  {
    id_fornecedor: 2,
    codigo_fornecedor: 'F002',
    nome_fornecedor: 'Tech Corp Eletrônicos',
    categoria: 'Eletrônica',
    cidade: 'São Paulo',
    status: 'Inativo',
    ativo: false,
  },
];

beforeEach(() => {
  mockedGetSuppliers.mockResolvedValue(suppliers as never);
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
      expect(mockedGetSuppliers).toHaveBeenCalledWith({
        fornecedor_nome: '',
        fornecedor_cidade: '',
        programa_nome: '',
        projeto_nome: '',
        categoria: '',
      })
    );
    expect(await screen.findByText('RTech Distribuidora 1 Ltda')).toBeTruthy();
    expect(screen.getByText('Tech Corp Eletrônicos')).toBeTruthy();
  });

  it('sends the typed filters to the backend when applying filters', async () => {
    renderWithRouter(<SuppliersScreen />);

    await screen.findByText('RTech Distribuidora 1 Ltda');

    const callsBeforeApply = mockedGetSuppliers.mock.calls.length;

    fireEvent.change(screen.getByPlaceholderText('Pesquisar fornecedores...'), {
      target: { value: 'RTech' },
    });
    fireEvent.change(screen.getByPlaceholderText('Filtrar por categorias...'), {
      target: { value: 'Solda' },
    });
    fireEvent.change(screen.getByPlaceholderText('Filtrar por cidades...'), {
      target: { value: 'Jundiaí' },
    });
    fireEvent.change(screen.getByPlaceholderText('Filtrar por programas...'), {
      target: { value: 'Programa Alfa' },
    });
    fireEvent.change(screen.getByPlaceholderText('Filtrar por projetos...'), {
      target: { value: 'Projeto X' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Aplicar Filtros' }));

    await waitFor(() =>
      expect(mockedGetSuppliers.mock.calls.length).toBeGreaterThan(callsBeforeApply)
    );

    expect(mockedGetSuppliers).toHaveBeenLastCalledWith({
      fornecedor_nome: 'RTech',
      categoria: 'Solda',
      fornecedor_cidade: 'Jundiaí',
      programa_nome: 'Programa Alfa',
      projeto_nome: 'Projeto X',
    });
  });

  it('opens the supplier modal when a card is clicked', async () => {
    renderWithRouter(<SuppliersScreen />);

    const supplierCard = await screen.findByRole('button', {
      name: 'Ver detalhes do fornecedor RTech Distribuidora 1 Ltda',
    });

    fireEvent.click(supplierCard);

    expect(
      await screen.findByRole('dialog', {
        name: 'Informações do fornecedor RTech Distribuidora 1 Ltda',
      })
    ).toBeTruthy();
  });
});
