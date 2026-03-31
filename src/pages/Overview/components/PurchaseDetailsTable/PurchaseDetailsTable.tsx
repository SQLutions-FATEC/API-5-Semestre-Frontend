import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import type { GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { ShoppingBag } from 'lucide-react';
import SectionHeader from '../../../../components/ui/SectionHeader/SectionHeader';
import PurchaseAlerts from '../PurchaseAlerts/PurchaseAlerts';
import type { PurchaseOrder } from '../../../../types/purchase';
import './PurchaseDetailsTable.scss';


const mockOrders: PurchaseOrder[] = [
  { id: 1, orderNumber: 'PC0001', issueDate: '2024-11-12', deliveryDate: '2024-12-21', leadTime: 39, supplier: 'HiTech Parts 78 Ltda', costCenter: 'Conversor DC-DC 3', paymentCondition: '30 dias', totalValue: 3623.56, allocatedValue: 3623.56, status: 'Cancelado', priority: 'Alta', notes: 'Cancelado pelo gerente' },
  { id: 2, orderNumber: 'PC0003', issueDate: '2022-04-14', deliveryDate: '2022-05-27', leadTime: 43, supplier: 'NovaTech Supply 69 Ltda', costCenter: 'Unidade Teste Aut.', paymentCondition: '60 dias', totalValue: 7599.80, allocatedValue: 0, status: 'Aberto', priority: 'Crítica', notes: 'Aguardando importação' },
  { id: 3, orderNumber: 'PC0005', issueDate: '2025-04-11', deliveryDate: '2025-04-19', leadTime: 8, supplier: 'JK Eletrônica 93 Ltda', costCenter: 'Sensor Pressão Ind.', paymentCondition: 'Vista', totalValue: 14983.20, allocatedValue: 14983.20, status: 'Parcialmente Entregue', priority: 'Média', notes: 'Lote 1 recebido' },
  { id: 4, orderNumber: 'PC0010', issueDate: '2024-09-23', deliveryDate: '2024-11-01', leadTime: 39, supplier: 'ZetaComp Brasil 27 Ltda', costCenter: 'Unidade Proteção Surto 3', paymentCondition: '30 dias', totalValue: 19408.06, allocatedValue: 19408.06, status: 'Entregue', priority: 'Crítica', notes: 'Finalizado' },
  { id: 5, orderNumber: 'PC0012', issueDate: '2022-10-27', deliveryDate: '2022-12-06', leadTime: 40, supplier: 'Yaskawa Parts 85 Ltda', costCenter: 'Fonte 24V 2', paymentCondition: '30 dias', totalValue: 9514.10, allocatedValue: 4757.05, status: 'Enviado', priority: 'Crítica', notes: 'Em trânsito internacional' },
  { id: 6, orderNumber: 'PC0013', issueDate: '2025-08-25', deliveryDate: '2025-10-05', leadTime: 41, supplier: 'NovaTech Supply 69 Ltda', costCenter: 'Placa Relé Inteligente 3', paymentCondition: '45 dias', totalValue: 8954.03, allocatedValue: 0, status: 'Parcialmente Entregue', priority: 'Alta', notes: 'Aguardando fornecedor' },
  { id: 7, orderNumber: 'PC0015', issueDate: '2025-05-09', deliveryDate: '2025-06-03', leadTime: 25, supplier: 'LiderComp 39 Ltda', costCenter: 'Placa Regulador 3', paymentCondition: '30 dias', totalValue: 17666.79, allocatedValue: 17666.79, status: 'Entregue', priority: 'Alta', notes: 'OK' },
  { id: 8, orderNumber: 'PC0017', issueDate: '2023-04-09', deliveryDate: '2023-05-20', leadTime: 41, supplier: 'Circuitech 16 Ltda', costCenter: 'Módulo Aquisição 3', paymentCondition: '30 dias', totalValue: 9585.40, allocatedValue: 9585.40, status: 'Entregue', priority: 'Baixa', notes: 'Solicitação extra' },
  { id: 9, orderNumber: 'PC0022', issueDate: '2025-07-15', deliveryDate: '2025-08-24', leadTime: 40, supplier: 'UniComp 32 Ltda', costCenter: 'Interface SPI ADC 2', paymentCondition: 'Vista', totalValue: 5757.94, allocatedValue: 5757.94, status: 'Enviado', priority: 'Crítica', notes: 'Urgente para testes' },
  { id: 10, orderNumber: 'PC0023', issueDate: '2025-01-28', deliveryDate: '2025-02-25', leadTime: 28, supplier: 'OmegaParts 13 Ltda', costCenter: 'Sensor Pressão Industrial', paymentCondition: '30 dias', totalValue: 17976.35, allocatedValue: 0, status: 'Aberto', priority: 'Alta', notes: 'Aguardando aprovação técnica' },
  { id: 11, orderNumber: 'PC0024', issueDate: '2024-09-14', deliveryDate: '2024-09-21', leadTime: 7, supplier: 'UniComp 99 Ltda', costCenter: 'Placa Filtro EMI 3', paymentCondition: 'Vista', totalValue: 24118.29, allocatedValue: 24118.29, status: 'Enviado', priority: 'Alta', notes: 'Entrega rápida solicitada' },
  { id: 12, orderNumber: 'PC0031', issueDate: '2023-04-10', deliveryDate: '2023-05-21', leadTime: 41, supplier: 'SilconWay 59 Ltda', costCenter: 'Módulo Aquisição 3', paymentCondition: '60 dias', totalValue: 13179.32, allocatedValue: 6589.66, status: 'Enviado', priority: 'Baixa', notes: 'Pendente de nota fiscal' },
  { id: 13, orderNumber: 'PC0037', issueDate: '2024-08-07', deliveryDate: '2024-08-29', leadTime: 22, supplier: 'ZetaComp 42 Ltda', costCenter: 'Módulo Ethernet Ind. 2', paymentCondition: '30 dias', totalValue: 319.73, allocatedValue: 319.73, status: 'Entregue', priority: 'Média', notes: 'Cabo de rede adicional' },
  { id: 14, orderNumber: 'PC0042', issueDate: '2024-09-04', deliveryDate: '2024-09-25', leadTime: 21, supplier: 'HiTech Parts 79 Ltda', costCenter: 'Interface SPI ADC 2', paymentCondition: '30 dias', totalValue: 23940.41, allocatedValue: 23940.41, status: 'Entregue', priority: 'Alta', notes: 'Completo' },
  { id: 15, orderNumber: 'PC0048', issueDate: '2023-02-13', deliveryDate: '2023-03-05', leadTime: 20, supplier: 'HiTech Parts 15 Ltda', costCenter: 'Placa Expansão GPIO 2', paymentCondition: 'Vista', totalValue: 17965.41, allocatedValue: 17965.41, status: 'Entregue', priority: 'Baixa', notes: 'Pedido via compras diretas' },
  { id: 16, orderNumber: 'PC0054', issueDate: '2025-01-19', deliveryDate: '2025-02-06', leadTime: 18, supplier: 'OmegaParts 37 Ltda', costCenter: 'Conversor DC-DC 3', paymentCondition: '30 dias', totalValue: 19258.96, allocatedValue: 19258.96, status: 'Entregue', priority: 'Alta', notes: 'Transformador ferrita' },
  { id: 17, orderNumber: 'PC0060', issueDate: '2024-11-19', deliveryDate: '2024-11-28', leadTime: 9, supplier: 'ZetaComp 98 Ltda', costCenter: 'Placa Relé Inteligente 3', paymentCondition: 'Vista', totalValue: 20265.53, allocatedValue: 20265.53, status: 'Entregue', priority: 'Crítica', notes: 'Urgente para linha B' },
  { id: 18, orderNumber: 'PC0069', issueDate: '2023-02-02', deliveryDate: '2023-03-05', leadTime: 31, supplier: 'Xpert Eletrônica 83 Ltda', costCenter: 'Módulo WiFi Bridge 2', paymentCondition: '45 dias', totalValue: 19677.24, allocatedValue: 9838.62, status: 'Parcialmente Entregue', priority: 'Alta', notes: 'Metade do lote chegou' },
  { id: 19, orderNumber: 'PC0071', issueDate: '2024-12-16', deliveryDate: '2025-01-07', leadTime: 22, supplier: 'NovaTech Supply 69 Ltda', costCenter: 'Interface SPI ADC 2', paymentCondition: '30 dias', totalValue: 21256.12, allocatedValue: 10628.06, status: 'Parcialmente Entregue', priority: 'Crítica', notes: 'Aguardando ADC' },
  { id: 20, orderNumber: 'PC0075', issueDate: '2025-03-29', deliveryDate: '2025-04-17', leadTime: 19, supplier: 'NovaTech Supply 69 Ltda', costCenter: 'Placa Regulador 3', paymentCondition: '30 dias', totalValue: 1430.69, allocatedValue: 1430.69, status: 'Entregue', priority: 'Alta', notes: 'OK' },
  { id: 21, orderNumber: 'PC0082', issueDate: '2022-04-14', deliveryDate: '2022-04-27', leadTime: 13, supplier: 'VoltParts 64 Ltda', costCenter: 'Unidade Teste Aut.', paymentCondition: 'Vista', totalValue: 20099.99, allocatedValue: 20099.99, status: 'Entregue', priority: 'Crítica', notes: 'Re-pedido' },
  { id: 22, orderNumber: 'PC0085', issueDate: '2024-09-25', deliveryDate: '2024-11-08', leadTime: 44, supplier: 'VoltParts 71 Ltda', costCenter: 'Placa Regulador Switching 3', paymentCondition: '60 dias', totalValue: 14541.70, allocatedValue: 14541.70, status: 'Entregue', priority: 'Baixa', notes: 'Regulador 12V' },
  { id: 23, orderNumber: 'PC0087', issueDate: '2025-04-22', deliveryDate: '2025-05-20', leadTime: 28, supplier: 'VoltParts 64 Ltda', costCenter: 'Controlador Motor Brushless 2', paymentCondition: '30 dias', totalValue: 6544.57, allocatedValue: 6544.57, status: 'Entregue', priority: 'Alta', notes: 'MOSFET Driver' },
  { id: 24, orderNumber: 'PC0092', issueDate: '2022-03-13', deliveryDate: '2022-03-20', leadTime: 7, supplier: 'BR Supply 91 Ltda', costCenter: 'Controlador Motor Brushless', paymentCondition: 'Vista', totalValue: 5585.18, allocatedValue: 5585.18, status: 'Entregue', priority: 'Alta', notes: 'NPN Transistor' },
  { id: 25, orderNumber: 'PC0096', issueDate: '2025-05-08', deliveryDate: '2025-05-21', leadTime: 13, supplier: 'UniComp 14 Ltda', costCenter: 'Módulo Supervisor 3', paymentCondition: '30 dias', totalValue: 13180.98, allocatedValue: 0, status: 'Enviado', priority: 'Alta', notes: 'Aguardando liberação fiscal' },
];

const PurchaseDetailsTable: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'orderNumber', headerName: 'Nº Pedido', width: 140, headerClassName: 'table-header' },
    { field: 'issueDate', headerName: 'Data Emissão', width: 130, valueFormatter: (value) => value ? new Date(value as string).toLocaleDateString('pt-BR') : '' },
    { field: 'deliveryDate', headerName: 'Data Previsão', width: 130, valueFormatter: (value) => value ? new Date(value as string).toLocaleDateString('pt-BR') : '' },
    { field: 'leadTime', headerName: 'Dias Previstos', width: 120, renderCell: (params) => `${params.value} d` },
    { field: 'supplier', headerName: 'Fornecedor', width: 220 },
    { field: 'costCenter', headerName: 'Centro de Custo', width: 200 },
    { field: 'paymentCondition', headerName: 'Condição Pagamento', width: 180 },
    { field: 'totalValue', headerName: 'Valor Total', width: 140, valueFormatter: (value) => (value as number)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    { field: 'allocatedValue', headerName: 'Valor Alocado', width: 140, valueFormatter: (value) => (value as number)?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => {
        let colors = { bg: '#edf2f7', text: '#4a5568' };
        if (params.value === 'Entregue') colors = { bg: '#e6fffa', text: '#047481' };
        else if (params.value === 'Cancelado') colors = { bg: '#fff5f5', text: '#c53030' };
        else if (params.value === 'Parcialmente Entregue' || params.value === 'Aberto') colors = { bg: '#fffaf0', text: '#9c4221' };
        else if (params.value === 'Enviado') colors = { bg: '#ebf8ff', text: '#2b6cb0' };

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: colors.bg,
              color: colors.text,
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          />
        );
      }
    },
    {
      field: 'priority',
      headerName: 'Prioridade',
      width: 130,
      renderCell: (params) => {
        let colors = { bg: '#edf2f7', text: '#4a5568' }; // Default
        if (params.value === 'Crítica') colors = { bg: '#fff5f5', text: '#c53030' };
        else if (params.value === 'Alta') colors = { bg: '#fffaf0', text: '#9c4221' };
        else if (params.value === 'Baixa') colors = { bg: '#ebf8ff', text: '#2b6cb0' };
        else if (params.value === 'Média') colors = { bg: '#fefcbf', text: '#744210' };

        return (
          <Chip
            label={params.value}
            size="small"
            sx={{
              fontWeight: 700,
              backgroundColor: colors.bg,
              color: colors.text,
              fontSize: '0.75rem',
              textTransform: 'uppercase'
            }}
          />
        );
      }
    },
    { field: 'notes', headerName: 'Observações', flex: 1, minWidth: 250 },
  ];

  return (
    <div className="purchase-details-container">
      <SectionHeader
        title="Detalhes das Compras"
        label="Tabela de compras"
        icon={<ShoppingBag size={20} />}
      />

      <div className="table-wrapper">
        <DataGrid
          rows={mockOrders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc !important',
              color: '#4a5568',
              fontWeight: 700,
            },
            '& .MuiDataGrid-columnHeader': {
              paddingLeft: '24px',
            },
            '& .MuiDataGrid-cell': {
              paddingLeft: '24px !important',
            },
            '& .MuiDataGrid-row:nth-of-type(even)': {
              backgroundColor: '#f1f5f973',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#e9e9e99a !important',
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </div>

      <PurchaseAlerts orders={mockOrders} />
    </div>
  );
};

export default PurchaseDetailsTable;
