import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RequestTable } from './RequestTable';

describe('RequestTable', () => {
  const mockSolicitacoes = [
    {
      numero_solicitacao: 'SOL-001',
      numero_pedido: 'PED-998',
      nome_material: 'Capacitor',
      data_solicitacao: '2026-04-10',
      valor_total_estimado: 966.8,
      status: 'Aprovada',
    },
    {
      numero_solicitacao: 'SOL-002',
      numero_pedido: null,
      nome_material: 'Sensor',
      data_solicitacao: '2026-04-15',
      valor_total_estimado: 358.3,
      status: 'Pendente',
    },
  ];

  it('renders correctly with data', () => {
    render(<RequestTable solicitacoes={mockSolicitacoes as any} />);

    expect(screen.getByText('Todas as Solicitações')).toBeInTheDocument();

    expect(screen.getByText('SOL-001')).toBeInTheDocument();
    expect(screen.getByText('Capacitor')).toBeInTheDocument();

    expect(screen.getByText(/R\$\s*966,80/i)).toBeInTheDocument();

    expect(screen.getByText('10/04/2026')).toBeInTheDocument();

    expect(screen.getByText('Aprovada')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
