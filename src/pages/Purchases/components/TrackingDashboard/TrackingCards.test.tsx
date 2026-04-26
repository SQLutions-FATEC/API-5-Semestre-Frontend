import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackingCards from './TrackingCards';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import type { PurchasesResponse } from '../../../../types/purchase';
import type { CriticalAlertsResponse } from '../../../../types/alerts';

describe('TrackingCards', () => {
  const mockCompras = {
    pedidos: [
      {
        numero: '123',
        fornecedor: 'Fornecedor A',
        status: 'aberto',
        data_pedido: '2023-01-01',
        prioridade: 'Urgente',
      },
      {
        numero: '456',
        fornecedor: 'Fornecedor B',
        status: 'enviado',
        data_pedido: '2023-01-01',
        prioridade: 'Alta',
      },
      {
        numero: '789',
        fornecedor: 'Fornecedor C',
        status: 'recebido',
        data_pedido: '2023-01-01',
        prioridade: 'Baixa',
      },
    ],
  };

  const mockAlertas = {
    alertas_criticos: {
      pedidos_atrasados: [
        { numero_pedido: '123', dias_atraso: 5 },
        { numero_pedido: '999', dias_atraso: 10 }, // testing missing supplier
      ],
      pedidos_prioritarios_pendentes: [
        {
          numero_pedido: '123',
          prioridade: 'Urgente',
          status: 'aberto',
          data_pedido: '2023-01-01',
        },
        { numero_pedido: '456', prioridade: 'Alta', status: 'enviado', data_pedido: '2023-01-01' },
        { numero_pedido: '000', prioridade: 'Urgente', status: 'cancelado', data_pedido: '' }, // missing date test
      ],
    },
  };

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-10'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders correctly with data', () => {
    render(
      <TrackingCards
        compras={mockCompras as unknown as PurchasesResponse}
        alertas={mockAlertas as unknown as CriticalAlertsResponse}
      />
    );

    // Check delayed orders
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Fornecedor A')).toBeInTheDocument();
    expect(screen.getByText('5 dias')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument(); // Missing supplier gets '-'

    // Check priority orders
    expect(screen.getAllByText(/123/).length).toBeGreaterThan(0); // using regex to match nested context if needed
    expect(screen.getAllByText('9')).toHaveLength(2); // days diff for 123 and 456 is 9 days
    expect(screen.getAllByText('0')).toHaveLength(1); // empty date falls back to 0
    expect(screen.getByText('2')).toBeInTheDocument(); // Active orders test (aberto + enviado)
  });

  it('renders correctly with empty data', () => {
    const emptyAlertas = {
      alertas_criticos: { pedidos_atrasados: [], pedidos_prioritarios_pendentes: [] },
    };
    render(
      <TrackingCards
        compras={{ pedidos: [] } as unknown as PurchasesResponse}
        alertas={emptyAlertas as unknown as CriticalAlertsResponse}
      />
    );

    const messages = screen.getAllByText('Nenhum item encontrado');
    expect(messages).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument(); // 0 active orders
  });
});
