import { AlertTriangle, ArrowRight, Clock, FileText } from 'lucide-react';
import type { RequestAnalytics, Solicitacao } from '../../../../types/requests';
import './KPICards.scss';
interface KpiCardsProps {
  readonly solicitacoes: Solicitacao[];
  readonly analytics: RequestAnalytics | null;
}

export function KpiCards({ solicitacoes, analytics }: KpiCardsProps) {
  const transformedRequests = solicitacoes.filter((req) => req.numero_pedido !== null);
  const totalPendentes = analytics?.total_pendentes || 0;
  const urgentRequests = (analytics?.urgentes_criticas || []).map((urgente) => {
    const materialVinculado = solicitacoes.find(
      (s) => s.numero_solicitacao === urgente.numero_solicitacao
    );
    return {
      ...urgente,
      nome_material: materialVinculado?.nome_material || 'Material indisponível',
    };
  });

  return (
    <div className="kpi-section grid-3">
      {/* Card 1 */}
      <div className="kpi-card">
        <div className="kpi-header">
          <div className="icon-container bg-blue">
            <FileText size={24} />
          </div>
          <span className="kpi-title">Convertidas em Pedido</span>
        </div>
        <div className="kpi-content scrollable-list">
          {transformedRequests.map((req) => (
            <div key={req.numero_solicitacao} className="conversion-row">
              <span className="req-id">{req.numero_solicitacao}</span>
              <ArrowRight size={14} className="arrow-icon" />
              <span className="order-id">{req.numero_pedido}</span>
            </div>
          ))}
          {transformedRequests.length === 0 && (
            <span className="empty-text">Nenhuma conversão.</span>
          )}
        </div>
      </div>

      {/* Card 2 */}
      <div className="kpi-card">
        <div className="kpi-header">
          <div className="icon-container bg-orange">
            <Clock size={24} />
          </div>
          <span className="kpi-title">Solicitações Pendentes</span>
        </div>
        <div className="kpi-value">{totalPendentes}</div>
      </div>

      {/* Card 3 */}
      <div className="kpi-card alert-card">
        <div className="kpi-header">
          <div className="icon-container bg-red">
            <AlertTriangle size={24} />
          </div>
          <span className="kpi-title">Urgentes / Alta Prioridade</span>
        </div>
        <div className="kpi-content scrollable-list">
          {urgentRequests.map((req) => (
            <div key={req.numero_solicitacao} className="urgent-row">
              <div className="urgent-info">
                <span className="req-id">{req.numero_solicitacao}</span>
                <span className="req-material">{req.nome_material}</span>
              </div>
              <div className="urgent-badge">{req.dias_desde_criacao} dias</div>
            </div>
          ))}
          {urgentRequests.length === 0 && (
            <span className="empty-text">Nenhuma urgência pendente.</span>
          )}
        </div>
      </div>
    </div>
  );
}
