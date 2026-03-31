import React from 'react';
import type { PurchaseOrder } from '../../../../types/purchase';
import TrackingCards from './TrackingCards';
import TrackingTable from './TrackingTable';
import './TrackingDashboard.scss';

// Mocked data including the specific objects mentioned and visible in the requirement
const mockTrackingOrders: PurchaseOrder[] = [
  { id: 1, orderNumber: 'PC0001', materialName: 'Diodo TVS SMBJ24A', materialStatus: 'Ativo', issueDate: '2024-11-12T00:00:00Z', deliveryDate: '2024-12-21T00:00:00Z', leadTime: 39, supplier: 'HiTech Parts 78 Ltda', costCenter: 'P&D', paymentCondition: '30 dias', totalValue: 3623.56, allocatedValue: 0, status: 'Cancelado', priority: 'Média', notes: '' },
  { id: 2, orderNumber: 'PC0002', materialName: 'Capacitor Cerâmico 100nF 0805', materialStatus: 'Obsoleto', issueDate: '2022-08-24T00:00:00Z', deliveryDate: '2022-09-19T00:00:00Z', leadTime: 26, supplier: 'Eletrosul Componentes 21 Ltda', costCenter: 'Manutenção', paymentCondition: 'Vista', totalValue: 14904.06, allocatedValue: 0, status: 'Cancelado', priority: 'Baixa', notes: '' },
  { id: 3, orderNumber: 'PC0003', materialName: 'Diodo Zener 5V1', materialStatus: 'Ativo', issueDate: '2022-04-14T00:00:00Z', deliveryDate: '2022-05-27T00:00:00Z', leadTime: 43, supplier: 'NovaTech Supply 69 Ltda', costCenter: 'Geral', paymentCondition: '60 dias', totalValue: 7599.8, allocatedValue: 0, status: 'Aberto', priority: 'Baixa', notes: '' },
  { id: 4, orderNumber: 'PC0005', materialName: 'Microcontrolador STM32', materialStatus: 'Ativo', issueDate: '2026-03-20T00:00:00Z', deliveryDate: '2026-03-24T00:00:00Z', leadTime: 4, supplier: 'Fornecedor1', costCenter: 'P&D', paymentCondition: 'Vista', totalValue: 4500.0, allocatedValue: 0, status: 'Aberto', priority: 'Urgente', notes: 'Needed ASAP' },
  { id: 5, orderNumber: 'PC0006', materialName: 'Módulo Relé', materialStatus: 'Ativo', issueDate: '2026-03-15T00:00:00Z', deliveryDate: '2026-03-23T00:00:00Z', leadTime: 8, supplier: 'Fornecedor2', costCenter: 'Geral', paymentCondition: '30 dias', totalValue: 1200.0, allocatedValue: 0, status: 'Enviado', priority: 'Média', notes: '' },
  { id: 6, orderNumber: 'PC0007', materialName: 'Display LCD 16x2', materialStatus: 'Ativo', issueDate: '2026-03-10T00:00:00Z', deliveryDate: '2026-03-22T00:00:00Z', leadTime: 12, supplier: 'Fornecedor3', costCenter: 'Projeto X', paymentCondition: '30 dias', totalValue: 800.0, allocatedValue: 0, status: 'Enviado', priority: 'Alta', notes: '' },
  { id: 7, orderNumber: 'PC0008', materialName: 'Conector KRE', materialStatus: 'Ativo', issueDate: '2026-03-28T00:00:00Z', deliveryDate: '2026-04-15T00:00:00Z', leadTime: 18, supplier: 'Componentes RS', costCenter: 'Projeto X', paymentCondition: 'Pix', totalValue: 150.0, allocatedValue: 0, status: 'Aberto', priority: 'Baixa', notes: '' },
  { id: 8, orderNumber: 'PC0009', materialName: 'CI Regulador LM317', materialStatus: 'Ativo', issueDate: '2026-01-10T00:00:00Z', deliveryDate: '2026-01-20T00:00:00Z', leadTime: 10, supplier: 'Mega Eletrônica', costCenter: 'Prototipagem', paymentCondition: 'Boleto', totalValue: 350.50, allocatedValue: 0, status: 'Recebido', priority: 'Média', notes: '' },
  { id: 9, orderNumber: 'PC0010', materialName: 'Placa Fenolite 10x10', materialStatus: 'Ativo', issueDate: '2026-02-05T00:00:00Z', deliveryDate: '2026-02-28T00:00:00Z', leadTime: 23, supplier: 'Prototipo PCB', costCenter: 'Geral', paymentCondition: 'Vista', totalValue: 600.0, allocatedValue: 0, status: 'Parcialmente recebido', priority: 'Média', notes: 'Faltam 50 unidades' },
];

const TrackingDashboard: React.FC = () => {
  return (
    <div className="tracking-dashboard">
      <TrackingCards orders={mockTrackingOrders} />
      <TrackingTable orders={mockTrackingOrders} />
    </div>
  );
};

export default TrackingDashboard;
