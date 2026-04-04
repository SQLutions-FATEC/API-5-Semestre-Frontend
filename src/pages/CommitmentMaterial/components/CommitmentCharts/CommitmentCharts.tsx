import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Material } from '../../../../types/commitment';
import './CommitmentCharts.scss';

type Props = {
  allData: Material[];      
  filteredData: Material[]; 
  selectedCategory: string;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CommitmentCharts({ allData, filteredData, selectedCategory }: Props) {
  
  const dataCategorias = Object.values(
    allData.reduce<Record<string, { name: string; value: number }>>((acc, item) => {
      const custo = item.amount_committed * item.unit_cost;
      if (!acc[item.category]) acc[item.category] = { name: item.category, value: 0 };
      acc[item.category].value += custo;
      return acc;
    }, {})
  );

  const dataPorMaterial = filteredData.map(item => ({
    name: item.name,
    value: item.amount_committed * item.unit_cost
  }));

  return (
    <div className="commitment-card charts-container">
      <div className="card-header">
        <h2>Análise de Custos</h2>
      </div>
      
      <div className="charts-display-wrapper">
        <div className="chart-item">
          <p className="chart-label">Visão Geral: Categorias</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={dataCategorias} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                {dataCategorias.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {selectedCategory !== 'todas' && (
          <div className="chart-item">
            <p className="chart-label">Itens em: {selectedCategory}</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataPorMaterial} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {dataPorMaterial.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}