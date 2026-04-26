import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProjectLayout from './ProjectLayout';
import { projectService } from '../../services/projectService';

// Extract the module mock out to the top level
vi.mock('../../services/projectService', () => ({
  projectService: {
    getOverview: vi.fn(),
  },
}));

describe('ProjectLayout', () => {
  it('renders loading state initially and then fetches success data', async () => {
    const mockData = {
      programa: { nome: 'Program Test', codigo: 'PRG1', gerente: 'Manager A' },
      projeto: {
        nome: 'Projeto X',
        codigo: 'PR1',
        data_fim_prevista: '2023-12-31',
        data_inicio: '2023-01-01',
        responsavel: 'Tester',
        status: 'ON_TRACK',
      },
    };
    (projectService.getOverview as vi.Mock).mockResolvedValueOnce(mockData);

    const { getByText, queryByText } = render(
      <MemoryRouter>
        <ProjectLayout>{(data) => <div>Child: {data?.projeto?.nome}</div>}</ProjectLayout>
      </MemoryRouter>
    );

    // Initial loading
    expect(getByText(/Carregando informações do projeto.../i)).toBeTruthy();

    await waitFor(() => {
      expect(queryByText(/Carregando informações do projeto.../i)).toBeNull();
      expect(getByText('Child: Projeto X')).toBeTruthy();
    });
  });

  it('handles error fetching data gracefully', async () => {
    (projectService.getOverview as vi.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const { queryByText, getByText } = render(
      <MemoryRouter>
        <ProjectLayout>
          {(data) => <div>Child Data is null: {data === null ? 'Yes' : 'No'}</div>}
        </ProjectLayout>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(queryByText(/Carregando/i)).toBeNull();
      expect(getByText('Child Data is null: Yes')).toBeTruthy();
    });
  });
});
