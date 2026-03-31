import React from 'react';
import { Clock, Zap, Ban } from 'lucide-react';
import type { PurchaseOrder } from '../../../../types/purchase';
import './PurchaseAlerts.scss';

interface PurchaseAlertsProps {
  orders: PurchaseOrder[];
}

const PurchaseAlerts: React.FC<PurchaseAlertsProps> = ({ orders }) => {
  const today = new Date();

  // Pedidos Atrasados (Data atual > Previsão e não entregues/cancelados)
  const delayedOrders = orders.filter(o => {
    const delivery = new Date(o.deliveryDate);
    return delivery < today && !['Entregue', 'Cancelado'].includes(o.status);
  });

  // Pedidos de Alta Prioridade pendentes (Alta/Crítica e não finalizados)
  const highPriorityPending = orders.filter(o => 
    (o.priority === 'Alta' || o.priority === 'Crítica') && 
    !['Entregue', 'Cancelado'].includes(o.status)
  );

  // Mock de Materiais Descontinuados utilizados no último mês
  // (Numa implementação real, isso viria de uma filtragem cruzada com a lista de materiais 'Obsoletos')
  const discontinuedMaterials = [
    { id: 101, name: 'Sensor Opto-isolado 4N25 (Obsoleto)', order: 'PC0023' },
    { id: 102, name: 'Relé de Estado Sólido 5V (Descontinuado)', order: 'PC0003' }
  ].filter(() => orders.some(o => ['PC0023', 'PC0003'].includes(o.orderNumber)));

  return (
    <div className="alert-sections-grid">
      <div className="alert-box">
        <h4 className="alert-title">
          <Clock size={18} color="#f56565" /> Pedidos Atrasados
        </h4>
        {delayedOrders.length > 0 ? (
          <ul>
            {delayedOrders.map(o => (
              <li key={o.id} className="alert-item error">
                {o.orderNumber} - {o.supplier}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">Tudo em dia!</p>
        )}
      </div>

      <div className="alert-box">
        <h4 className="alert-title">
          <Zap size={18} color="#ed8936" /> Alta Prioridade Pendentes
        </h4>
        {highPriorityPending.length > 0 ? (
          <ul>
            {highPriorityPending.map(o => (
              <li key={o.id} className="alert-item warning">
                {o.orderNumber} - {o.supplier}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">Nenhum pendente</p>
        )}
      </div>

      <div className="alert-box">
        <h4 className="alert-title">
          <Ban size={18} color="#4299e1" /> Materiais Descontinuados (Último Mês)
        </h4>
        {discontinuedMaterials.length > 0 ? (
          <ul>
            {discontinuedMaterials.map(m => (
              <li key={m.id} className="alert-item info">
                {m.name} - Ref: {m.order}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">Nenhum item crítico</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseAlerts;
