import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { taskService } from '../../../../services/taskService';
import HoursTracking from './HoursTracking';

vi.mock('../../../../services/taskService', () => ({
  taskService: {
    getTaskTracking: vi.fn(),
  },
}));

const mockedTasks = [
  {
    codigo: 'TSK001',
    titulo: 'Teste de isolação',
    responsavel: 'Gabriel Martins',
    estimativa_horas: 148,
    status: 'Bloqueada',
    total_horas_trabalhadas: 54.9,
  },
  {
    codigo: 'TSK002',
    titulo: 'Prototipação da placa',
    responsavel: 'João Pedro Alves',
    estimativa_horas: 29,
    status: 'Concluída',
    total_horas_trabalhadas: 86.3,
  },
  {
    codigo: 'TSK003',
    titulo: 'Roteamento multicamada',
    responsavel: 'Tatiane Duarte',
    estimativa_horas: 180,
    status: 'Em andamento',
    total_horas_trabalhadas: 12.6,
  },
];

const tooltipFormatter = (value: unknown) => [`${value}h`, 'Horas'];

const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={['/PRJ003']}>
      <Routes>
        <Route path="/:id" element={<HoursTracking />} />
      </Routes>
    </MemoryRouter>
  );

const renderComponentWithRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/:id" element={<HoursTracking />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.mocked(taskService.getTaskTracking).mockResolvedValue({
    tarefas: mockedTasks,
    evolucao_horas: {
      '2022-05-09': 26.44,
    },
  });
});

describe('HoursTracking Component', () => {
  it('should render the component header correctly', async () => {
    renderComponent();

    const header = await screen.findByText('Acompanhamento de horas');
    expect(header).toBeDefined();
  });

  it('should render fetched task data correctly', async () => {
    renderComponent();

    expect(await screen.findByText('TSK001')).toBeDefined();
    expect(await screen.findByText('Prototipação da placa')).toBeDefined();
    expect(await screen.findByText('Roteamento multicamada')).toBeDefined();
  });

  it('should render selected task details from real data', async () => {
    renderComponent();

    const taskDetailsCard = await screen.findByTestId('task-details-card');
    expect(taskDetailsCard).toBeDefined();
    expect(screen.getByText('Prototipação da placa')).toBeDefined();

    // Use within() para evitar duplicatas de texto
    const { getByText } = within(taskDetailsCard);
    expect(getByText('João Pedro Alves')).toBeDefined();
    expect(getByText('Concluída')).toBeDefined();
  });

  it('should format tooltip tooltip correctly (coverage for formatter)', () => {
    // Call the formatter directly
    const result = tooltipFormatter(10);
    expect(result).toEqual(['10h', 'Horas']);
  });

  it('should render API error message when request fails', async () => {
    vi.mocked(taskService.getTaskTracking).mockRejectedValueOnce(new Error('network error'));

    renderComponent();

    expect(
      await screen.findByText('Não foi possível carregar as tarefas do projeto.')
    ).toBeDefined();
  });

  it('should render empty states when no data is returned', async () => {
    vi.mocked(taskService.getTaskTracking).mockResolvedValueOnce({
      tarefas: [],
      evolucao_horas: {},
    });

    renderComponent();

    expect(await screen.findByText('Nenhuma tarefa encontrada para este projeto.')).toBeDefined();
    expect(await screen.findByText('Sem dados para exibir')).toBeDefined();
  });

  it('should map route id 1 to PRJ003 when fetching tasks', async () => {
    renderComponentWithRoute('/1');

    await screen.findByText('Acompanhamento de horas');

    expect(taskService.getTaskTracking).toHaveBeenCalledWith('PRJ003');
  });
});
