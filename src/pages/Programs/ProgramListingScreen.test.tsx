import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgramListingScreen from './ProgramListingScreen';
import { programService } from '../../services/programService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

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
    (programService.getAllPrograms as any).mockResolvedValue(mockPrograms);
  });

  it('deve carregar e exibir a listagem de programas ao renderizar', async () => {
    render(<ProgramListingScreen />);

    expect(screen.getByText('Programas')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
      expect(screen.getByText('Modernização Aviônica')).toBeInTheDocument();
    });

    expect(screen.getByText(/Carlos Eduardo/i)).toBeInTheDocument();
    expect(screen.getByText(/Rafael Carvalho/i)).toBeInTheDocument();
  });

  it('deve filtrar os programas através da barra de busca', async () => {
    render(<ProgramListingScreen />);

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar programa por nome ou código...');

    await userEvent.type(searchInput, 'AVION');

    expect(screen.getByText('Modernização Aviônica')).toBeInTheDocument();
    expect(screen.queryByText('Manutenção e Suporte')).not.toBeInTheDocument();
  });

  it('deve exibir mensagem caso nenhum programa seja encontrado no filtro', async () => {
    render(<ProgramListingScreen />);

    await waitFor(() => {
      expect(screen.getByText('Manutenção e Suporte')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar programa por nome ou código...');

    await userEvent.type(searchInput, 'Programa Inexistente');

    expect(screen.queryByText('Manutenção e Suporte')).not.toBeInTheDocument();
  });
});