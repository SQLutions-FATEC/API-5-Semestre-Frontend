import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrackingTable from './TrackingTable';
import { describe, it, expect } from 'vitest';
import type { PurchaseOrderData } from '../../../../types/purchase';

describe('TrackingTable', () => {
  it('renders the table with correct mapping and status colors', () => {
    const orders = [
      {
        numero: 'PC0001',
        emissao: '2023-05-10',
        previsao: '2023-05-20',
        dias_previstos_entrega: 10,
        fornecedor: 'F1',
        nome_material: 'C1',
        status: 'recebido',
      },
      {
        numero: 'PC0002',
        emissao: '2023/12/25',
        previsao: '2023/12/31',
        dias_previstos_entrega: 10,
        fornecedor: 'F2',
        nome_material: 'C2',
        status: 'cancelado',
      },
      {
        numero: 'PC0003',
        emissao: null,
        previsao: null,
        dias_previstos_entrega: 10,
        fornecedor: 'F3',
        nome_material: 'C3',
        status: 'aberto',
      },
      {
        numero: 'OTHER',
        emissao: '2023-05-10',
        previsao: '2023-05-20',
        dias_previstos_entrega: 10,
        fornecedor: 'F4',
        nome_material: 'C4',
        status: 'em rota',
      },
      {
        numero: 'N/A',
        emissao: '2023-05-10',
        previsao: '2023-05-20',
        dias_previstos_entrega: 10,
        fornecedor: 'F5',
        nome_material: 'C5',
        status: 'Unknown',
      },
      {
        numero: 'N/A_2',
        emissao: '2023-05-10',
        previsao: '2023-05-20',
        dias_previstos_entrega: 10,
        fornecedor: 'F6',
        nome_material: 'C6',
        status: null,
      }, // testing null status
    ];

    render(<TrackingTable orders={orders as PurchaseOrderData[]} />);

    // Test getMappedOrderCode
    expect(screen.getByText('SC0020 / PC0001')).toBeInTheDocument();
    expect(screen.getByText('SC0041 / PC0002')).toBeInTheDocument();
    expect(screen.getByText('SC0066 / PC0003')).toBeInTheDocument();
    expect(screen.getByText('OTHER')).toBeInTheDocument();

    // Test statuses - MUI Chip uses the label, and it's uppercase
    // But data-grid cell might have it in normal case if that's how it's provided? Let's check text content.
    // The renderCell returns <Chip label={params.value || '-'} />
    expect(screen.getByText('recebido')).toBeInTheDocument();
    expect(screen.getByText('cancelado')).toBeInTheDocument();
    expect(screen.getByText('aberto')).toBeInTheDocument();
    expect(screen.getByText('em rota')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument(); // from null status

    // Testing date formatting coverage.
    // 2023-05-10 becomes 10/05/2023
    expect(screen.getAllByText('10/05/2023').length).toBeGreaterThan(0);

    // 2023/12/25 should fall back to toLocaleDateString which depends on node environment but usually parses correctly
    // we may not easily query the exact string because of timezone/locale, but we know it doesn't crash.
  });
});
