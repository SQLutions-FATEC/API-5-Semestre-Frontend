import { useEffect, useState } from 'react';
import type { RequestMock } from '../../types/requests';
import { KpiCards } from './components/KPICards/KPICards';
import { RequestTable } from './components/RequestTable/RequestTable';
import './RequestDashboardScreen.scss';

const mockData: RequestMock[] = [
  {
    id: '1',
    numero_solicitacao: 'SOL-001',
    numero_pedido: 'PED-998',
    nome_material: 'Capacitor Cerâmico 10uF',
    data_solicitacao: '2026-04-10',
    valor_total_estimado: 966.8,
    status: 'Aprovada',
    prioridade: 'Média',
    dias_desde_criacao: 9,
  },
  {
    id: '2',
    numero_solicitacao: 'SOL-002',
    numero_pedido: null,
    nome_material: 'Sensor Umidade DHT22',
    data_solicitacao: '2026-04-15',
    valor_total_estimado: 358.3,
    status: 'Pendente',
    prioridade: 'Crítica',
    dias_desde_criacao: 4,
  },
  {
    id: '3',
    numero_solicitacao: 'SOL-003',
    numero_pedido: null,
    nome_material: 'Microcontrolador ARM',
    data_solicitacao: '2026-03-20',
    valor_total_estimado: 2500.0,
    status: 'Pendente',
    prioridade: 'Alta',
    dias_desde_criacao: 30,
  },
  {
    id: '4',
    numero_solicitacao: 'SOL-004',
    numero_pedido: null,
    nome_material: 'Resistor 1k Ohm',
    data_solicitacao: '2026-04-18',
    valor_total_estimado: 45.0,
    status: 'Cancelada',
    prioridade: 'Baixa',
    dias_desde_criacao: 1,
  },
  {
    id: '5',
    numero_solicitacao: 'SOL-005',
    numero_pedido: 'PED-1002',
    nome_material: 'Placa de Circuito Impresso',
    data_solicitacao: '2026-04-05',
    valor_total_estimado: 5400.0,
    status: 'Rejeitada',
    prioridade: 'Média',
    dias_desde_criacao: 14,
  },
];

export default function RequestDashboardScreen() {
  const [requests, setRequests] = useState<RequestMock[]>([]);

  // Simula o carregamento da API
  useEffect(() => {
    setRequests(mockData);
  }, []);

  return (
    <div className="request-dashboard-wrapper">
      <div className="dashboard-header">
        <h2>Dashboard de Solicitações</h2>
        <span className="subtitle">Acompanhamento e rastreio de materiais</span>
      </div>

      {/* Orquestração dos Componentes Filhos */}
      <KpiCards requests={requests} />
      <RequestTable requests={requests} />
    </div>
  );
}
