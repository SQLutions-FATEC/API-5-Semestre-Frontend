import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpensesTable from './ExpensesTable';
import { describe, it, expect } from 'vitest';

const mockPedidos = [
  {
    numero_pedido: 'PC1',
    material_nome: 'Mat 1',
    fornecedor_nome: 'Forn 1',
    valor_total_pedido: 100,
    status: 'CANCELADO',
  },
  {
    numero_pedido: 'PC2',
    material_nome: 'Mat 2',
    fornecedor_nome: 'Forn 2',
    valor_total_pedido: 200,
    status: 'ENTREGUE',
  },
  {
    numero_pedido: 'PC3',
    material_nome: 'Mat 3',
    fornecedor_nome: 'Forn 3',
    valor_total_pedido: 300,
    status: 'PARCIAL',
  },
  {
    numero_pedido: 'PC4',
    material_nome: 'Mat 4',
    fornecedor_nome: 'Forn 4',
    valor_total_pedido: 400,
    status: 'REJEITADA',
  },
  {
    numero_pedido: 'PC5',
    material_nome: 'Mat 5',
    fornecedor_nome: 'Forn 5',
    valor_total_pedido: 500,
    status: 'APROVADA',
  },
  {
    numero_pedido: 'PC6',
    material_nome: 'Mat 6',
    fornecedor_nome: 'Forn 6',
    valor_total_pedido: 600,
    status: 'RECEBIDO',
  },
  {
    numero_pedido: 'PC7',
    material_nome: 'Mat 7',
    fornecedor_nome: 'Forn 7',
    valor_total_pedido: 700,
    status: 'PENDENTE',
  },
  {
    numero_pedido: 'PC8',
    material_nome: 'Mat 8',
    fornecedor_nome: 'Forn 8',
    valor_total_pedido: 800,
    status: 'ABERTO',
  },
  {
    numero_pedido: 'PC9',
    material_nome: 'Mat 9',
    fornecedor_nome: 'Forn 9',
    valor_total_pedido: 900,
    status: 'UNKNOWN_STATUS',
  },
];

describe('ExpensesTable', () => {
  it('covers all getStatusColors branches and formats currency correctly', async () => {
    render(<ExpensesTable pedidos={mockPedidos} />);

    const select = screen.getByRole('combobox');
    fireEvent.mouseDown(select);
    const listbox = await screen.findByRole('listbox');
    fireEvent.click(within(listbox).getByText('10'));

    expect(screen.getByText('CANCELADO')).toHaveStyle('color: rgb(197, 48, 48)');
    expect(screen.getByText('REJEITADA')).toHaveStyle('color: rgb(197, 48, 48)');

    expect(screen.getByText('ENTREGUE')).toHaveStyle('color: rgb(4, 116, 129)');
    expect(screen.getByText('APROVADA')).toHaveStyle('color: rgb(4, 116, 129)');
    expect(screen.getByText('RECEBIDO')).toHaveStyle('color: rgb(4, 116, 129)');

    expect(screen.getByText('PARCIAL')).toHaveStyle('color: rgb(156, 66, 33)');
    expect(screen.getByText('PENDENTE')).toHaveStyle('color: rgb(156, 66, 33)');
    expect(screen.getByText('ABERTO')).toHaveStyle('color: rgb(156, 66, 33)');

    expect(screen.getByText('UNKNOWN_STATUS')).toHaveStyle('color: rgb(74, 85, 104)');

    expect(screen.getByText(/R\$.*100,00/)).toBeInTheDocument();
  });

  it('handles page navigation', () => {
    render(<ExpensesTable pedidos={mockPedidos} />);

    expect(screen.getByText('PC1')).toBeInTheDocument();
    expect(screen.queryByText('PC6')).not.toBeInTheDocument();

    const nextButton = screen.getByTitle('Go to next page');
    fireEvent.click(nextButton);

    expect(screen.getByText('PC6')).toBeInTheDocument();
    expect(screen.queryByText('PC1')).not.toBeInTheDocument();
  });
});
