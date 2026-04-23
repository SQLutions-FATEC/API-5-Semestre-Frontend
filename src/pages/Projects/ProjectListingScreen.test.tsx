import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectListingScreen from './ProjectListingScreen';
import { projectService } from '../../services/projectService';
import { vi } from 'vitest';

//mocka o service para não bater na API real durante o teste
vi.mock('../../services/projectService', () => ({
  projectService: {
    getPrograms: vi.fn(),
    getProjectsByProgram: vi.fn(),
  },
}));

const mockPrograms = [
  { codigo: 'P1', nome: 'Programa 1' },
  { codigo: 'P2', nome: 'Programa 2' },
];

const mockProjects = [
  { codigo: 'PRJ-01', nome: 'Alpha', responsavel: 'João', status: 'Ativo' },
  { codigo: 'PRJ-02', nome: 'Beta', responsavel: 'Maria', status: 'Atrasado' },
];

describe('ProjectListingScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (projectService.getPrograms as any).mockResolvedValue(mockPrograms);
    (projectService.getProjectsByProgram as any).mockResolvedValue(mockProjects);
  });

  it('deve carregar os programas e o primeiro projeto ao renderizar', async () => {
    render(<ProjectListingScreen />);

    //verifica se os programas foram carregados no select
    await waitFor(() => {
      expect(screen.getByDisplayValue('Programa 1')).toBeInTheDocument();
    });

    //verifica se os projetos do programa 1 apareceram
    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
      expect(screen.getByText('Beta')).toBeInTheDocument();
    });
  });

  it('deve filtrar os projetos pela barra de busca', async () => {
    render(<ProjectListingScreen />);

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar projeto por nome ou código...');

    //digita "Alpha" na busca
    await userEvent.type(searchInput, 'Alpha');

    //Alpha deve continuar na tela, mas Beta deve sumir
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Beta')).not.toBeInTheDocument();
  });
});
