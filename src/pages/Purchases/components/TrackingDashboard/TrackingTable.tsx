import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chip, Tooltip } from '@mui/material';
import type { PurchaseOrder } from '../../../../types/purchase';
import { sharedDataGridStyles } from '../../../../styles/sharedDataGridStyles';
import './TrackingTable.scss';

interface TrackingTableProps {
  orders: PurchaseOrder[];
}

const TrackingTable: React.FC<TrackingTableProps> = ({ orders }) => {
  const columns: GridColDef[] = [
    {
      field: 'orderNumber',
      headerName: 'Cód do pedido',
      width: 140,
      headerClassName: 'table-header',
    },
    {
      field: 'materialName',
      headerName: 'Nome do material',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        const isObsolete = params.row.materialStatus === 'Obsoleto';
        const content = (
          <span
            style={{
              color: isObsolete ? '#e53e3e' : 'inherit',
              fontWeight: isObsolete ? 600 : 'normal',
            }}
          >
            {params.value}
          </span>
        );

        if (isObsolete) {
          return (
            <Tooltip title="Material Obsoleto" placement="top">
              {content}
            </Tooltip>
          );
        }
        return content;
      },
    },
    {
      field: 'issueDate',
      headerName: 'Data de emissão',
      width: 150,
      valueFormatter: (value) =>
        value ? new Date(value as string).toLocaleDateString('pt-BR') : '',
    },
    {
      field: 'deliveryDate',
      headerName: 'Data de previsão de entrega',
      width: 220,
      valueFormatter: (value) =>
        value ? new Date(value as string).toLocaleDateString('pt-BR') : '',
    },
    { field: 'supplier', headerName: 'Fornecedor', flex: 1, minWidth: 200 },
    {
      field: 'totalValue',
      headerName: 'Valor total pedido',
      width: 160,
      valueFormatter: (value) =>
        (value as number)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
    {
      field: 'status',
      headerName: 'Status do pedido',
      width: 180,
      renderCell: (params) => {
        let colors = { bg: '#edf2f7', text: '#4a5568' };

        switch (params.value) {
          case 'Recebido':
          case 'Entregue':
            colors = { bg: '#e6fffa', text: '#047481' };
            break;
          case 'Cancelado':
            colors = { bg: '#fff5f5', text: '#c53030' };
            break;
          case 'Parcialmente recebido':
          case 'Parcialmente Entregue':
          case 'Aberto':
            colors = { bg: '#fffaf0', text: '#9c4221' };
            break;
          case 'Enviado':
          case 'Em rota':
            colors = { bg: '#ebf8ff', text: '#2b6cb0' };
            break;
        }

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: colors.bg,
              color: colors.text,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="tracking-table-container">
      <div className="table-wrapper">
        <DataGrid
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          sx={sharedDataGridStyles}
        />
      </div>
    </div>
  );
};

export default TrackingTable;
