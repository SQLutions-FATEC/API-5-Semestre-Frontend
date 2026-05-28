import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SuppliersScreen from './SuppliersScreen';

// Mock do ProjectLayout para evitar problemas com dependências internas dele
vi.mock('../../components/ProjectLayout/ProjectLayout', () => ({
  default: ({ children }: { children: any }) => (
    <div data-testid="mock-project-layout">
      {typeof children === 'function' ? children() : children}
    </div>
  ),
}));

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
  it('renders without crashing', () => {
    const { container, getByText } = renderWithRouter(<SuppliersScreen />);
    expect(container).toBeTruthy();
    expect(getByText('Fornecedores')).toBeTruthy();
  });

  it('renders the mocked suppliers cards', () => {
    const { getAllByText } = renderWithRouter(<SuppliersScreen />);
    // We have 9 mock cards with the same name
    const supplierNames = getAllByText('RTech Distribuidora 1 Ltda');
    expect(supplierNames.length).toBeGreaterThan(0);
  });

  it('updates the search term when typing in the search input', () => {
    const { getByPlaceholderText } = renderWithRouter(<SuppliersScreen />);

    const searchInput = getByPlaceholderText('Pesquisar fornecedores...') as HTMLInputElement;
    expect(searchInput.value).toBe('');

    fireEvent.change(searchInput, { target: { value: 'Tech' } });
    expect(searchInput.value).toBe('Tech');
  });

  it('updates the material type filter when typing', () => {
    const { getByPlaceholderText } = renderWithRouter(<SuppliersScreen />);

    const materialInput = getByPlaceholderText('Filtrar por categorias...') as HTMLInputElement;
    expect(materialInput.value).toBe('');

    fireEvent.change(materialInput, { target: { value: 'Solda' } });
    expect(materialInput.value).toBe('Solda');
  });

  it('updates the city filter when typing', () => {
    const { getByPlaceholderText } = renderWithRouter(<SuppliersScreen />);

    const cityInput = getByPlaceholderText('Filtrar por cidades...') as HTMLInputElement;
    expect(cityInput.value).toBe('');

    fireEvent.change(cityInput, { target: { value: 'São Paulo' } });
    expect(cityInput.value).toBe('São Paulo');
  });

  it('updates the program filter when typing', () => {
    const { getByPlaceholderText } = renderWithRouter(<SuppliersScreen />);

    const programInput = getByPlaceholderText('Filtrar por programas...') as HTMLInputElement;
    expect(programInput.value).toBe('');

    fireEvent.change(programInput, { target: { value: 'Programa X' } });
    expect(programInput.value).toBe('Programa X');
  });

  it('updates the project filter when typing', () => {
    const { getByPlaceholderText } = renderWithRouter(<SuppliersScreen />);

    const projectInput = getByPlaceholderText('Filtrar por projetos...') as HTMLInputElement;
    expect(projectInput.value).toBe('');

    fireEvent.change(projectInput, { target: { value: 'Projeto Y' } });
    expect(projectInput.value).toBe('Projeto Y');
  });
});
