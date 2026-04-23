import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import type { ExpenseEvolution, ExpenseDetail } from '../../../../types/expenses';
import { DollarSign, Inbox } from 'lucide-react';
import './ExpensesCharts.scss';

type Props = {
  evolution: ExpenseEvolution[];
  total: number;
  pedidos: ExpenseDetail[];
};

const COLORS = [
  '#004587',
  '#FF5722',
  '#FFC107',
  '#4CAF50',
  '#9C27B0',
  '#00BCD4',
];

const formatMonthYear = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const [year, month] = dateStr.split('-');
  return `${month}/${year}`;
};

export default function ExpensesCharts({ evolution, total, pedidos }: Props) {
  const materialData = useMemo(() => {
    const counts: Record<string, number> = {};
    pedidos.forEach((p) => {
      if (p.status !== 'CANCELADO') {
        counts[p.material_nome] = (counts[p.material_nome] || 0) + p.valor_total_pedido;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [pedidos]);

  const formattedEvolution = useMemo(() => {
    return evolution.map((item) => ({
      ...item,
      displayDate: formatMonthYear(item.data),
    }));
  }, [evolution]);

  const hasEvolution = formattedEvolution.length > 0;
  const hasMaterials = materialData.length > 0;

  return (
    <div className="expenses-charts-container">
      <div className="charts-grid">
        {/* Line Chart: Evolution */}
        <div className="chart-card">
          <h4 className="chart-title">Evolução do Gasto</h4>
          <div className="chart-wrapper">
            {hasEvolution ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={formattedEvolution} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                    tickFormatter={(value) =>
                      `R$ ${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`
                    }
                  />
                  <Tooltip
                    labelFormatter={(label) => `Período: ${label}`}
                    formatter={(value: any) => [
                      Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                      'Total Gasto',
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    type="monotone"
                    dataKey="total_gasto"
                    name="Gasto Mensal"
                    stroke="#004587"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#004587' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">
                <Inbox size={40} />
                <span>Nenhum dado de evolução disponível</span>
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart: Cost per Material with Integrated Total Pill */}
        <div className="chart-card distribution-card">
          <div className="total-pill-wrapper">
            <div className={`total-pill ${total === 0 ? 'empty' : ''}`}>
              <div className="pill-icon">
                <DollarSign size={14} />
              </div>
              <span className="pill-text">
                {total > 0 
                  ? `Gasto total: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                  : 'Nenhum gasto registrado'}
              </span>
            </div>
          </div>

          <h4 className="chart-title">Custo por Material</h4>

          <div className="chart-wrapper">
            {hasMaterials ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={materialData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {materialData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                    }
                  />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="legend-text">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">
                <Inbox size={40} />
                <span>Nenhum dado de materiais disponível</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
