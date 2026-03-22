import { Hash, Briefcase, UserCircle, CalendarRange, CircleDollarSign, Clock, Landmark } from 'lucide-react';
import './OverviewMetrics.scss';

export default function OverviewMetrics() {
  const projectStats = [
    {
      title: 'Custo Empenhado',
      value: 'R$ 32.189.432,00',
      icon: <CircleDollarSign size={24} color="#10b981" />,
      bgClass: 'bg-green'
    },
    {
      title: 'Horas trabalhadas',
      value: '321 horas',
      icon: <Clock size={24} color="#3b82f6" />,
      bgClass: 'bg-blue'
    },
    {
      title: 'Custo Total',
      value: 'R$ 312.312.312.312,00',
      icon: <Landmark size={24} color="#f59e0b" />,
      bgClass: 'bg-orange'
    }
  ];

  const programMetrics = [
    {
      title: 'Código do Programa',
      value: 'MAX12AC',
      icon: <Hash size={24} color="#10b981" />,
      bgClass: 'bg-green'
    },
    {
      title: 'Nome do Programa',
      value: 'MAX 1.2 AC',
      icon: <Briefcase size={24} color="#3b82f6" />,
      bgClass: 'bg-blue'
    },
    {
      title: 'Gerente do Programa',
      value: 'Ana Paula Ribeiro',
      icon: <UserCircle size={24} color="#f59e0b" />,
      bgClass: 'bg-orange'
    },
    {
      title: 'Previsão de Fim',
      value: '30/01/2027',
      icon: <CalendarRange size={24} color="#8b5cf6" />,
      bgClass: 'bg-purple'
    }
  ];

  return (
    <div className="overview-metrics-wrapper">

      <div className="metrics-grid grid-3">
        {projectStats.map((m, idx) => (
          <div key={`stat-${idx}`} className="metric-card">
            <div className="metric-header">
              <div className={`icon-container ${m.bgClass}`}>
                {m.icon}
              </div>
              <span className="metric-title">{m.title}</span>
            </div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="metrics-grid grid-4">
        {programMetrics.map((m, idx) => (
          <div key={`prog-${idx}`} className="metric-card">
            <div className="metric-header">
              <div className={`icon-container ${m.bgClass}`}>
                {m.icon}
              </div>
              <span className="metric-title">{m.title}</span>
            </div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
