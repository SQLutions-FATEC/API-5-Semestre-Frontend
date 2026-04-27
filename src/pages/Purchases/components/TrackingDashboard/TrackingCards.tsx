import { AlertCircle, CheckCircle, ShoppingCart, Truck } from 'lucide-react';
import React from 'react';
import type { CriticalAlertsResponse } from '../../../../types/alerts';
import type { PurchasesResponse } from '../../../../types/purchase';
import './TrackingCards.scss';

interface TrackingCardsProps {
  alertas: CriticalAlertsResponse;
  compras: PurchasesResponse;
}

const TrackingCards: React.FC<TrackingCardsProps> = ({ alertas, compras }) => {
  const {
    pedidos_atrasados,
    pedidos_prioritarios_pendentes,
    solicitacoes_para_projetos = []
  } = alertas.alertas_criticos;

  const today = new Date();

  const getDaysDiff = (dateStr: string) => {
    if (!dateStr) return 0;
    const dDate = new Date(dateStr);
    const diffTime = today.getTime() - dDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getSupplier = (numero: string) => {
    return compras.pedidos.find((p) => p.numero === numero)?.fornecedor || '-';
  };

  const activeOrdersCount = compras.pedidos.filter((o) =>
    ['aberto', 'enviado', 'em rota'].includes(o.status.toLowerCase())
  ).length;

  return (
    <div className="tracking-cards-grid">
      {/* Card 1: Pedidos Atrasados */}
      <div className="tracking-card simple-list-card delayed-card">
        <h4 className="card-title">
          <Truck size={20} className="icon-alert" /> Histórico de entregas atrasadas
        </h4>
        {pedidos_atrasados.length > 0 ? (
          <div className="list-container">
            <div className="list-header">
              <span>Pedido</span>
              <span>Fornecedor</span>
              <span>Atraso</span>
            </div>
            <div className="list-body">
              {pedidos_atrasados.map((o) => (
                <div key={o.numero_pedido} className="list-row">
                  <span>{o.numero_pedido}</span>
                  <span>{getSupplier(o.numero_pedido)}</span>
                  <span>{o.dias_atraso} dias</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="empty-message">Nenhum item encontrado</p>
        )}
      </div>

      {/* Card 2: Alta Prioridade */}
      <div className="tracking-card complex-list-card priority-card">
        <h4 className="card-title">
          <AlertCircle size={20} className="icon-critical" /> Pedidos de alta prioridade abertos ou em rota
        </h4>
        {pedidos_prioritarios_pendentes.length > 0 ? (
          <div className="list-container">
            <div className="list-header">
              <span>Pedido</span>
              <span>Estado</span>
              <span>Dias desde a emissão</span>
            </div>
            <div className="list-body">
              {pedidos_prioritarios_pendentes.map((o) => {
                const isUrgent = o.prioridade?.toLowerCase() === 'urgente';
                const priorityClass = isUrgent ? 'badge-urgent' : 'badge-high';
                const isAberto = o.status?.toLowerCase() === 'aberto';

                return (
                  <div key={o.numero_pedido} className="list-row">
                    <span className={`priority-badge ${priorityClass}`}>
                      {o.numero_pedido} {o.prioridade}
                      {isUrgent && <AlertCircle size={12} />}
                    </span>
                    <span className="status-cell">
                      {isAberto ? <ShoppingCart size={16} /> : <Truck size={16} />}
                      {o.status?.toLowerCase() === 'enviado' ? 'Em rota' : o.status}
                    </span>
                    <span>{getDaysDiff(o.data_pedido)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="empty-message">Nenhum item encontrado</p>
        )}
      </div>

      {/* Card 3: Últimas Solicitações Convertidas */}
      <div className="tracking-card simple-list-card recent-card">
        <h4 className="card-title">
          <CheckCircle size={20} className="icon-success" style={{ color: '#047481' }} /> Últimas Aprovações
        </h4>
        {solicitacoes_para_projetos.length > 0 ? (
          <div className="list-container">
            <div className="list-header">
              <span>Solicitação</span>
              <span>Pedido Gerado</span>
            </div>
            <div className="list-body">
              {solicitacoes_para_projetos.map((s) => (
                <div key={s.numero_solicitacao} className="list-row">
                  <span style={{ fontWeight: 600, color: '#4a5568' }}>{s.numero_solicitacao}</span>
                  <span style={{ color: '#2b6cb0', fontWeight: 600 }}>{s.numero_pedido}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="empty-message">Nenhuma solicitação recente aprovada</p>
        )}
      </div>

      {/* Card 4: Total */}
      <div className="tracking-card summary-card total-card">
        <h4 className="summary-title">Pedidos Abertos ou em Rota</h4>
        <div className="big-number">{activeOrdersCount}</div>
      </div>
    </div>
  );
};

export default TrackingCards;