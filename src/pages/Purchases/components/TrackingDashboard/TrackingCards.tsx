import React from 'react';
import type { PurchaseOrder } from '../../../../types/purchase';
import { Truck, AlertCircle, ShoppingCart } from 'lucide-react';
import './TrackingCards.scss';

interface TrackingCardsProps {
  orders: PurchaseOrder[];
}

const TrackingCards: React.FC<TrackingCardsProps> = ({ orders }) => {
  const today = new Date();

  const getDaysDiff = (dateStr: string) => {
    const dDate = new Date(dateStr);
    const diffTime = today.getTime() - dDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  const delayedOrders = orders.filter((o) => {
    const deliveryDate = new Date(o.deliveryDate);
    return deliveryDate < today && !['Entregue', 'Recebido', 'Cancelado'].includes(o.status);
  });

  const priorityOrders = orders.filter(
    (o) => ['Alta', 'Urgente'].includes(o.priority) && ['Aberto', 'Enviado'].includes(o.status)
  );

  const activeOrdersCount = orders.filter((o) => ['Aberto', 'Enviado'].includes(o.status)).length;

  return (
    <div className="tracking-cards-grid">
      {/* Card 1: Pedidos Atrasados */}
      <div className="tracking-card simple-list-card delayed-card">
        <h4 className="card-title">
          <Truck size={20} className="icon-alert" /> Histórico de entregas atrasadas
        </h4>
        {delayedOrders.length > 0 ? (
          <div className="list-container">
            <div className="list-header">
              <span>Pedido</span>
              <span>Fornecedor</span>
              <span>Atraso</span>
            </div>
            <div className="list-body">
              {delayedOrders.map((o) => (
                <div key={o.id} className="list-row">
                  <span>{o.orderNumber}</span>
                  <span>{o.supplier}</span>
                  <span>{getDaysDiff(o.deliveryDate)} dias</span>
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
          <AlertCircle size={20} className="icon-critical" /> Pedidos de alta prioridade abertos ou
          em rota
        </h4>
        {priorityOrders.length > 0 ? (
          <div className="list-container">
            <div className="list-header">
              <span>Pedido</span>
              <span>Estado</span>
              <span>Dias desde a emissão</span>
            </div>
            <div className="list-body">
              {priorityOrders.map((o) => {
                const priorityClass = o.priority === 'Urgente' ? 'badge-urgent' : 'badge-high';
                return (
                  <div key={o.id} className="list-row">
                    <span className={`priority-badge ${priorityClass}`}>
                      {o.orderNumber} {o.priority}{' '}
                      {o.priority === 'Urgente' && <AlertCircle size={12} />}
                    </span>
                    <span className="status-cell">
                      {o.status === 'Aberto' ? <ShoppingCart size={16} /> : <Truck size={16} />}
                      {o.status === 'Enviado' ? 'Em rota' : o.status}
                    </span>
                    <span>{getDaysDiff(o.issueDate)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="empty-message">Nenhum item encontrado</p>
        )}
      </div>

      {/* Card 3: Total */}
      <div className="tracking-card summary-card total-card">
        <h4 className="summary-title">Pedidos Abertos ou em Rota</h4>
        <div className="big-number">{activeOrdersCount}</div>
      </div>
    </div>
  );
};

export default TrackingCards;
