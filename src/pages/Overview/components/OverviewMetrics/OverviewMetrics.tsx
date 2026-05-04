import { Boxes, CircleDollarSign, Clock, Timer } from 'lucide-react';
import type { Financeiro } from '../../../../types/project';
import './OverviewMetrics.scss';

interface OverviewMetricsProps {
  readonly financeiro?: Financeiro;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatHours = (decimalHours: number): string => {
  if (!decimalHours || Number.isNaN(decimalHours)) return '0h 00m';
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  if (minutes === 60) {
    return `${hours + 1}h 00m`;
  }

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

export default function OverviewMetrics({ financeiro }: OverviewMetricsProps) {
  const financialMetrics = [
    {
      title: 'Total em Horas Trabalhadas',
      value: financeiro ? formatHours(financeiro.total_horas_trabalhadas) : '0h 00m',
      icon: <Clock size={24} />,
      bgClass: 'bg-orange',
    },
    {
      title: 'Total de Horas Previstas',
      value: financeiro ? formatHours(financeiro.horas_totais_estimadas) : '0h 00m',
      icon: <Timer size={24} />,
      bgClass: 'bg-blue',
    },
    {
      title: 'Valor Empenhado',
      value: financeiro ? formatCurrency(financeiro.custo_total_materiais) : 'R$ 0,00',
      icon: <CircleDollarSign size={24} />,
      bgClass: 'bg-green',
    },
    {
      title: 'Gasto Total',
      value: financeiro ? formatCurrency(financeiro.custo_total_projeto) : 'R$ 0,00',
      icon: <Boxes size={24} />,
      bgClass: 'bg-purple',
    },
  ];

  return (
    <div className="overview-metrics-wrapper">
      <div className="metrics-grid grid-4">
        {financialMetrics.map((m) => (
          <div key={m.title} className="metric-card">
            <div className="metric-header">
              <div className={`icon-container ${m.bgClass}`}>{m.icon}</div>
              <span className="metric-title">{m.title}</span>
            </div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
