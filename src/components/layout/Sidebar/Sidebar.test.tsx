import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

// Mock useMatch e useLocation para testar a renderização dos links
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useMatch: () => ({ params: { programa_cod: '123', codigo_projeto: '456' } }),
    useLocation: () => ({ pathname: '/programas/123/projetos/456' }),
  };
});

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

  it('accepts a valid csv file without showing error toast (mock backend success)', async () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggle={mockToggle} />
      </MemoryRouter>
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['id,name\n1,test'], 'data.csv', { type: 'text/csv' });

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Arquivo pronto para envio:', 'data.csv');
    });

    consoleSpy.mockRestore();
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

      // Simulando o lançamento de um erro pelo backend através de um spy no console.log
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Erro na importação: Os dados estão no formato incorreto');
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText('Erro na importação: Os dados estão no formato incorreto')
        ).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('mostra erro de células vazias', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Erro na importação: Células vazias detectadas no documento');
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(
          screen.getByText('Erro na importação: Células vazias detectadas no documento')
        ).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('mostra erro genérico desconhecido', async () => {
      const { container } = render(
        <MemoryRouter>
          <Sidebar isCollapsed={false} onToggle={mockToggle} />
        </MemoryRouter>
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['1,2,3'], 'data.csv', { type: 'text/csv' });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
        throw new Error('Outro erro de servidor');
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByText('Outro erro de servidor')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });
});
