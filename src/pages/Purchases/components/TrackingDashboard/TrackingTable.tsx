import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chip } from '@mui/material';
import type { PurchaseOrderData } from '../../../../types/purchase';
import { sharedDataGridStyles } from '../../../../styles/sharedDataGridStyles';
import './TrackingTable.scss';

interface TrackingTableProps {
  orders: PurchaseOrderData[];
}

const getMappedOrderCode = (backendCode: string) => {
  const map: Record<string, string> = {
    PC0001: 'SC0020 / PC0001',
    PC0002: 'SC0041 / PC0002',
    PC0003: 'SC0066 / PC0003',
  };
  return map[backendCode] || backendCode;
};

const TrackingTable: React.FC<TrackingTableProps> = ({ orders }) => {
  const columns: GridColDef[] = [
    {
      field: 'numero',
      headerName: 'Cod de pedido',
      width: 160,
      headerClassName: 'table-header',
      valueGetter: (_, row) => getMappedOrderCode(row.numero),
    },
    { field: 'nome_material', headerName: 'Nome Material', flex: 1, minWidth: 150 },
    // Valor faltando no backend
    // {
    //   field: 'materialName',
    //   headerName: 'Nome do material',
    //   flex: 1,
    //   minWidth: 250,
    //   renderCell: (params) => {
    //     const isObsolete = params.row.materialStatus === 'Obsoleto';
    //     const content = (
    //       <span
    //         style={{
    //           color: isObsolete ? '#e53e3e' : 'inherit',
    //           fontWeight: isObsolete ? 600 : 'normal',
    //         }}
    //       >
    //         {params.value}
    //       </span>
    //     );

    //     if (isObsolete) {
    //       return (
    //         <Tooltip title="Material Obsoleto" placement="top">
    //           {content}
    //         </Tooltip>
    //       );
    //     }
    //     return content;
    //   }
    // },
    {
      field: 'emissao',
      headerName: 'Data de emissão',
      width: 150,
      valueFormatter: (value) => {
        if (!value) return '';
        const [y, m, d] = (value as string).split('-');
        if (y && m && d) return `${d}/${m}/${y}`;
        return new Date(value as string).toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'previsao',
      headerName: 'Data de previsão de entrega',
      width: 220,
      valueFormatter: (value) => {
        if (!value) return '';
        const [y, m, d] = (value as string).split('-');
        if (y && m && d) return `${d}/${m}/${y}`;
        return new Date(value as string).toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'dias_previstos_entrega',
      headerName: 'Dias previstos para entrega',
      width: 210,
    },
    { field: 'fornecedor', headerName: 'Fornecedor', flex: 1, minWidth: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => {
        let colors = { bg: '#edf2f7', text: '#4a5568' };

        switch (params.value?.toString().toLowerCase()) {
          case 'recebido':
          case 'entregue':
          case 'concluida':
            colors = { bg: '#e6fffa', text: '#047481' };
            break;
          case 'cancelado':
            colors = { bg: '#fff5f5', text: '#c53030' };
            break;
          case 'parcialmente recebido':
          case 'parcialmente entregue':
          case 'aberto':
            colors = { bg: '#fffaf0', text: '#9c4221' };
            break;
          case 'enviado':
          case 'em rota':
            colors = { bg: '#ebf8ff', text: '#2b6cb0' };
            break;
        }

        return (
          <Chip
            label={params.value || '-'}
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
          getRowId={(row) => row.numero}
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
