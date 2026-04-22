import { AlertTriangle, ArrowRight, Clock, FileText } from 'lucide-react';
import type { RequestMock } from '../../../../types/requests';
import './KPICards.scss';
interface KpiCardsProps {
    requests: RequestMock[];
}

export function KpiCards({ requests }: KpiCardsProps) {
    const transformedRequests = requests.filter(req => req.numero_pedido !== null);
    const pendingCount = requests.filter(req => req.status === 'Pendente').length;
    const urgentRequests = requests
        .filter(req => req.status === 'Pendente' && ['Alta', 'Urgente'].includes(req.prioridade))
        .sort((a, b) => b.dias_desde_criacao - a.dias_desde_criacao);

    return (
        <div className="kpi-section grid-3">
            {/* Card 1 */}
            <div className="kpi-card">
                <div className="kpi-header">
                    <div className="icon-container bg-blue"><FileText size={24} /></div>
                    <span className="kpi-title">Convertidas em Pedido</span>
                </div>
                <div className="kpi-content scrollable-list">
                    {transformedRequests.map(req => (
                        <div key={req.id} className="conversion-row">
                            <span className="req-id">{req.numero_solicitacao}</span>
                            <ArrowRight size={14} className="arrow-icon" />
                            <span className="order-id">{req.numero_pedido}</span>
                        </div>
                    ))}
                    {transformedRequests.length === 0 && <span className="empty-text">Nenhuma conversão.</span>}
                </div>
            </div>

            {/* Card 2 */}
            <div className="kpi-card">
                <div className="kpi-header">
                    <div className="icon-container bg-orange"><Clock size={24} /></div>
                    <span className="kpi-title">Solicitações Pendentes</span>
                </div>
                <div className="kpi-value">{pendingCount}</div>
            </div>

            {/* Card 3 */}
            <div className="kpi-card alert-card">
                <div className="kpi-header">
                    <div className="icon-container bg-red"><AlertTriangle size={24} /></div>
                    <span className="kpi-title">Críticas / Alta Prioridade</span>
                </div>
                <div className="kpi-content scrollable-list">
                    {urgentRequests.map(req => (
                        <div key={req.id} className="urgent-row">
                            <div className="urgent-info">
                                <span className="req-id">{req.numero_solicitacao}</span>
                                <span className="req-material">{req.nome_material}</span>
                            </div>
                            <div className="urgent-badge">{req.dias_desde_criacao} dias</div>
                        </div>
                    ))}
                    {urgentRequests.length === 0 && <span className="empty-text">Nenhuma urgência pendente.</span>}
                </div>
            </div>
        </div>
    );
}