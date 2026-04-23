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
import './ExpensesCharts.scss';

type Props = {
  evolution: ExpenseEvolution[];
  total: number;
  pedidos: ExpenseDetail[];
};

const COLORS = [
  '#004587', // Dark Blue
  '#FF5722', // Orange
  '#FFC107', // Amber
  '#4CAF50', // Green
  '#9C27B0', // Purple
  '#00BCD4', // Cyan
];

export default function ExpensesCharts({ evolution, total, pedidos }: Props) {
  // Calculate cost per material for the donut chart
  const materialData = useMemo(() => {
    const counts: Record<string, number> = {};
    pedidos.forEach((p) => {
      // We only sum costs for non-cancelled orders or all? 
      // The image shows "Diodo Retificador" etc. Usually, it's total committed/spent.
      if (p.status !== 'CANCELADO') {
        counts[p.material_nome] = (counts[p.material_nome] || 0) + p.valor_total_pedido;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [pedidos]);

  return (
    <div className="expenses-charts-container">
      <div className="charts-header">
        <div className="total-expense-card">
          <div className="total-icon">
            <span className="currency-symbol">$</span>
          </div>
          <div className="total-content">
            <span className="total-label">Gasto total:</span>
            <span className="total-value">
              {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Line Chart: Evolution */}
        <div className="chart-card">
          <h4 className="chart-title">Evolução do Gasto</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolution} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="data" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                  label={{ value: 'Data', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                  label={{ value: 'Custo', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => 
                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  }
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_gasto" 
                  stroke="#004587" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#004587', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Cost per Material */}
        <div className="chart-card">
          <h4 className="chart-title">Custo por Material</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => 
                    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  }
                />
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle" 
                  iconType="circle"
                  formatter={(value) => <span className="legend-text">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
