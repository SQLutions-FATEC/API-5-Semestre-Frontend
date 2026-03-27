import { CircleDollarSign, Clock, Timer, Boxes } from 'lucide-react';
import './OverviewMetrics.scss';

export default function OverviewMetrics() {
  const financialMetrics = [
    // Soma da coluna valor_alocado da tabela compras_projeto para este projeto.
    {
      title: 'Valor Total Alocado',
      value: 'R$ 50,00',
      icon: <CircleDollarSign size={24} />,
      bgClass: 'bg-green'
    },
    // Soma da coluna estimativa_horas da tabela tarefas_projeto para as tarefas relacionadas a este projeto.
    {
      title: 'Total de Horas Estimadas',
      value: '92,0',
      icon: <Timer size={24} />,
      bgClass: 'bg-blue'
    },
    // Soma da coluna horas_trabalhadas da tabela tempo_tarefas para as tarefas relacionadas a este projeto 
    // (através da tabela tarefas_projeto).
    {
      title: 'Total em Horas Trabalhadas',
      value: '3,02',
      icon: <Clock size={24} />,
      bgClass: 'bg-orange'
    },
    //  Soma do custo_estimado_usd da tabela materiais_engenharia multiplicado pela quantidade_empenhada 
    // da tabela empenho_materiais para os materiais relacionados a este projeto (através da tabela empenho_materiais).
    {
      title: 'Custo Total Empenhado',
      value: 'R$ 7.053,04',
      icon: <Boxes size={24} />,
      bgClass: 'bg-purple'
    }
  ];

  return (
    <div className="overview-metrics-wrapper">
      <div className="metrics-grid grid-4">
        {financialMetrics.map((m, idx) => (
          <div key={`fin-${idx}`} className="metric-card">
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
