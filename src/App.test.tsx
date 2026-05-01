import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock all services to prevent real API calls during app rendering
vi.mock('./services/projectService', () => ({
  projectService: {
    getOverview: vi.fn().mockResolvedValue(null),
    getPurchases: vi.fn().mockResolvedValue({ compras: [] }),
    getCriticalAlerts: vi.fn().mockResolvedValue({ alertas_criticos: {} }),
    getPrograms: vi.fn().mockResolvedValue([]),
    getProjectsByProgram: vi.fn().mockResolvedValue([]),
    getExpensesDetails: vi.fn().mockResolvedValue({}),
    getExpensesEvolution: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('./services/commitmentService', () => ({
  commitmentService: {
    getAlerts: vi.fn().mockResolvedValue({ alertas_criticos: { materiais_obsoletos: [] } }),
    getAnalytics: vi.fn().mockResolvedValue({
      empenho_por_categoria: [],
      empenho_por_material: [],
      empenho_por_tempo: [],
      empenho_total: 0,
    }),
  },
}));

vi.mock('./services/requestService', () => ({
  getSolicitacoes: vi.fn().mockResolvedValue([]),
  getSolicitacoesAnalytics: vi.fn().mockResolvedValue({}),
}));

vi.mock('./services/taskService', () => ({
  taskService: {
    getTaskTracking: vi.fn().mockResolvedValue({ tarefas: [], evolucao_horas: {} }),
    getTasks: vi.fn().mockResolvedValue([]),
  },
}));

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeTruthy();
  });
});
