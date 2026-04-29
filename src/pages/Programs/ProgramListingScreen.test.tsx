import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProgramListingScreen from './ProgramListingScreen';
import { programService } from '../../services/programService';

vi.mock('../../services/programService', () => ({
  programService: {
    getAllPrograms: vi.fn(),
  },
}));

const mockPrograms = [
  { 
    codigo: 'MANSUP', 
    nome: 'Manutenção e Suporte', 
    gerente: 'Carlos Eduardo', 
    gerente_tecnico: 'Rafael Carvalho', 
    status: 'Ativo' 
  },
  { 
    codigo: 'AVION-X', 
    nome: 'Modernização Aviônica', 
    gerente: 'Ana Paula', 
    gerente_tecnico: 'Bruno Oliveira', 
    status: 'Atrasado' 
  },
];

describe('ProgramListingScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (programService.getAllPrograms as any).mockImplementation((q?: string) => {
      if (!q) return Promise.resolve(mockPrograms);
      return Promise.resolve(mockPrograms.filter(p => p.nome.toLowerCase().includes(q.toLowerCase()) || p.codigo.toLowerCase().includes(q.toLowerCase())));
    });
  });

  it('deve renderizar a página e carregar os programas corretamente', async () => {
    render(
      <MemoryRouter>
        <ProgramListingScreen />
      </MemoryRouter>
    );

    expect(screen.getByText('Programas')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
      expect(screen.getByText('Modernização Aviônica')).toBeInTheDocument();
    });

    expect(screen.getByText('MANSUP')).toBeInTheDocument();
    expect(screen.getByText('AVION-X')).toBeInTheDocument();
  });

  it('deve filtrar os programas por nome', async () => {
    render(
      <MemoryRouter>
        <ProgramListingScreen />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar programa por nome ou código/i);

    await userEvent.type(searchInput, 'Modernização{enter}');

    expect(screen.getByText('Modernização Aviônica')).toBeInTheDocument();
    expect(screen.queryByText('Manutenção e Suporte')).not.toBeInTheDocument();
  });

  it('deve exibir feedback visual (Empty State) quando nenhum programa for encontrado', async () => {
    render(
      <MemoryRouter>
        <ProgramListingScreen />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Buscar programa por nome ou código/i);

    await userEvent.type(searchInput, 'Programa Fantasma{enter}');

    expect(screen.getByText('Nenhum programa encontrado')).toBeInTheDocument();
    expect(screen.getByText(/Programa Fantasma/i)).toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /Limpar busca/i });
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);

    expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
    expect(searchInput).toHaveValue('');
  });
});