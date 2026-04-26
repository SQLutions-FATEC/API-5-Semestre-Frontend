import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSolicitacoes, getSolicitacoesAnalytics } from '../../services/requestService';
import type { RequestAnalytics, Solicitacao } from '../../types/requests';
import { KpiCards } from './components/KPICards/KPICards';
import { RequestTable } from './components/RequestTable/RequestTable';
import './RequestDashboardScreen.scss';

export default function RequestDashboardScreen() {
  const { id = 'PRJ003' } = useParams<{ id: string }>();

  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [analytics, setAnalytics] = useState<RequestAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);

        const [listaData, analyticsData] = await Promise.all([
          getSolicitacoes(id),
          getSolicitacoesAnalytics(id),
        ]);

        setSolicitacoes(listaData.solicitacoes || []);
        setAnalytics(analyticsData.estatisticas || null);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Carregando dados...</div>;
  if (error)
    return <div style={{ padding: '2rem', color: '#c53030' }}>Erro ao carregar os dados.</div>;

  return (
    <div className="request-dashboard-wrapper">
      <div className="dashboard-header">
        <h2>Dashboard de Solicitações</h2>
        <span className="subtitle">Acompanhamento e rastreio de materiais</span>
      </div>
      <KpiCards solicitacoes={solicitacoes} analytics={analytics} />
      <RequestTable solicitacoes={solicitacoes} />
    </div>
  );
}
