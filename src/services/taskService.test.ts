import { vi, describe, it, expect } from 'vitest';
import { taskService } from './taskService';
import { api } from './api';

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('taskService', () => {
  it('getTaskTracking should normalize an array response correctly', async () => {
    const mockData = [
      {
        codigo: 'T1',
        titulo: 'Task 1',
        responsavel: 'John',
        estimativa: 10,
        status: 'OPEN',
        total_horas_trabalhadas: 5,
      },
    ];
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const result = await taskService.getTaskTracking('PRJ001');

    expect(api.get).toHaveBeenCalledWith('/projetos/tarefas/PRJ001');
    expect(result.tarefas[0].codigo).toBe('T1');
    expect(result.tarefas[0].estimativa_horas).toBe(10);
    expect(result.evolucao_horas).toEqual({});
  });

  it('getTaskTracking should normalize an object with tarefas array correctly', async () => {
    const mockData = {
      projeto: { codigo: 'PRJ001', nome: 'Proj 1' },
      tarefas: [
        {
          codigo: 'T2',
          titulo: 'Task 2',
          responsavel: 'Jane',
          estimativa_horas: 8,
          status: 'DONE',
          total_horas_trabalhadas: 8,
        },
      ],
      evolucao_horas: { '2023-10-01': 5, '2023-10-02': null },
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const result = await taskService.getTaskTracking('PRJ001');

    expect(result.projeto?.codigo).toBe('PRJ001');
    expect(result.tarefas[0].codigo).toBe('T2');
    expect(result.evolucao_horas).toEqual({ '2023-10-01': 5, '2023-10-02': 0 });
  });

  it('getTaskTracking should default values when undefined', async () => {
    const mockData = { data: [{ codigo: 'T3', titulo: 'T3', responsavel: 'Bob', status: 'WIP' }] };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });
    const result = await taskService.getTaskTracking('PRJ001');
    expect(result.tarefas[0].estimativa_horas).toBe(0);
    expect(result.tarefas[0].total_horas_trabalhadas).toBe(0);
  });

  it('getTasks should return only the tasks array', async () => {
    const mockData = {
      results: [{ codigo: 'T4', titulo: 'T4', responsavel: 'Alice', status: 'CLOSED' }],
    };
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockData });

    const result = await taskService.getTasks('PRJ001');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].codigo).toBe('T4');
  });
});
