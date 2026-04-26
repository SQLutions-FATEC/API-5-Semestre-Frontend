import { Chip } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import type { Solicitacao } from '../../../../types/requests';
import './RequestTable.scss';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Aprovada: { bg: '#e6fffa', text: '#047481' },
  Pendente: { bg: '#fffaf0', text: '#dd6b20' },
  Cancelada: { bg: '#fff5f5', text: '#c53030' },
  Rejeitada: { bg: '#fed7d7', text: '#9b2c2c' },
};

const columns: GridColDef[] = [
  { field: 'numero_solicitacao', headerName: 'Nº Solicitação', width: 140 },
  { field: 'nome_material', headerName: 'Nome do Material', flex: 1, minWidth: 200 },
  {
    field: 'data_solicitacao',
    headerName: 'Data de Solicitação',
    width: 160,
    renderCell: (p) => formatDate(p.value as string | null),
  },
  {
    field: 'valor_total_estimado',
    headerName: 'Valor Total',
    width: 160,
    renderCell: (p) => formatCurrency(Number(p.value)),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (p) => {
      const colors = statusColors[p.value as string] || { bg: '#edf2f7', text: '#4a5568' };
      return (
        <Chip
          label={p.value as string}
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

interface RequestTableProps {
  readonly solicitacoes: Solicitacao[];
}

export function RequestTable({ solicitacoes }: RequestTableProps) {
  return (
    <div className="table-section">
      <h3>Todas as Solicitações</h3>
      <div style={{ width: '100%' }}>
        <DataGrid
          rows={solicitacoes}
          columns={columns}
          getRowId={(row) => row.numero_solicitacao}
          autoHeight
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': { borderBottom: '1px solid #edf2f7' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#f7fafc', borderBottom: 'none' },
          }}
        />
      </div>
    </div>
  );
}
