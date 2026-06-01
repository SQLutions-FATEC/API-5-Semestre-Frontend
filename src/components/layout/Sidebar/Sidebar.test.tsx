import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import { api } from '../../../services/api';

// Mock useMatch e useLocation para testar a renderização dos links
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useMatch: () => ({ params: { programa_cod: '123', codigo_projeto: '456' } }),
    useLocation: () => ({ pathname: '/programas/123/projetos/456' }),
  };
});

vi.mock('../../../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('Sidebar', () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and shows brand name when not collapsed', () => {
    render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );
    expect(screen.getByText('SIATT')).toBeInTheDocument();
  });

  it('hides brand name when collapsed', () => {
    render(
      <MemoryRouter>
        <Sidebar isCollapsed={true} onToggle={mockToggle} />
      </MemoryRouter>
    );
    expect(screen.queryByText('SIATT')).not.toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', () => {
    render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );
    const toggleBtn = screen.getByRole('button', { name: '' }); // The button only has an icon
    fireEvent.click(toggleBtn);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders nav items based on route matches', () => {
    render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );
    expect(screen.getByText('Visão Geral')).toBeInTheDocument();
    expect(screen.getByText('Compras')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
  });

  it('triggers file input when "Importar planilha" is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );
    const importBtn = screen.getByText('Importar planilha').closest('button');
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, 'click');
    if (importBtn) fireEvent.click(importBtn);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('shows error toast when a non-csv file is selected', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText('Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.')
      ).toBeInTheDocument();
    });
  });

  it('closes toast when close button is clicked', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    // Trigger toast
    fireEvent.change(fileInput, { target: { files: [file] } });

    const toastMessage = await screen.findByText(
      'Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.'
    );
    expect(toastMessage).toBeInTheDocument();

    // Find the close button of the Snackbar
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.'
        )
      ).not.toBeInTheDocument();
    });
  });

  it('ignores toast close when reason is clickaway', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const toastMessage = await screen.findByText(
      'Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.'
    );
    expect(toastMessage).toBeInTheDocument();

    // Simula o evento de clickaway pressionando ESC, que as vezes despacha onClose com clickaway no MUI
    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    // Opcionalmente, podemos acionar onClick away clicando no background do presentation
    const presentation = screen.queryByRole('presentation');
    if (presentation && presentation.firstChild) {
      fireEvent.click(presentation.firstChild as Element);
    }

    // O texto ainda deve estar no documento (toast aberto)
    expect(
      screen.getByText('Erro na seleção: Formato de arquivo não suportado, só é permitido .csv.')
    ).toBeInTheDocument();
  });

  it('does nothing if no file is selected', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [] } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('accepts a valid csv file and shows success toast on successful api post', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['id,name\n1,test'], 'data.csv', { type: 'text/csv' });

    vi.mocked(api.post).mockResolvedValueOnce({
      data: { mensagem: 'Importação realizada com sucesso' },
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/importar_dados/',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      expect(screen.getByText('Importação realizada com sucesso')).toBeInTheDocument();
    });
  });

  describe('Simulação de erros do backend', () => {
    it('mostra erro de formato incorreto', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { erro: 'formato incorreto' } },
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText('Erro na importação: Os dados estão no formato incorreto')
        ).toBeInTheDocument();
      });
    });

    it('mostra erro de células vazias', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { erro: 'Células vazias' } },
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText('Erro na importação: Células vazias detectadas no documento')
        ).toBeInTheDocument();
      });
    });

    it('mostra erro "Arquivo não enviado"', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { erro: 'Arquivo não enviado' } },
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Arquivo não enviado')).toBeInTheDocument();
      });
    });

    it('mostra erro "Apenas arquivos CSV são permitidos"', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      vi.mocked(api.post).mockRejectedValueOnce({
        response: { data: { erro: 'Apenas arquivos CSV são permitidos' } },
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Apenas arquivos CSV são permitidos')).toBeInTheDocument();
      });
    });

    it('mostra erro genérico desconhecido caso falhe com erro diferente', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      vi.mocked(api.post).mockRejectedValueOnce(new Error('Outro erro de servidor'));

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Outro erro de servidor')).toBeInTheDocument();
      });
    });
  });
});
