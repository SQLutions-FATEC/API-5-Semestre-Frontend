import { useMemo, useState } from 'react';
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
} from 'recharts';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../services/commitmentService';
import './CommitmentCharts.scss';

type Props = {
  readonly empenhoCategoria: EmpenhoCategoria[];
  readonly empenhoTempo: EmpenhoTempo[];
  readonly empenhoMaterial?: any[];
  readonly total: number;
};

// Cores baseadas no mockup para o gráfico de rosca
const COLORS = [
  '#0f4a8e', '#facc15', '#ea580c', '#10b981',
  '#8b5cf6', '#ec4899', '#06b6d4', '#eab308',
];

export default function CommitmentCharts({
  empenhoCategoria,
  empenhoTempo,
  empenhoMaterial,
  total,
}: Props) {
  const [viewMode, setViewMode] = useState<'geral' | 'categoria'>('geral');

  // Transforma os dados temporais para ter uma chave por categoria
  const transformedTempo = useMemo(() => {
    if (viewMode === 'geral') return empenhoTempo;

    const materialCategoryMap: Record<string, string> = {};
    if (empenhoMaterial) {
      empenhoMaterial.forEach((m) => {
        materialCategoryMap[m.codigo_material] = m.categoria;
      });
    }

    return empenhoTempo.map((tempoP) => {
      const newP: any = { data: tempoP.data };
      tempoP.materiais?.forEach((m) => {
        const cat = materialCategoryMap[m.codigo_material] || 'Sem Categoria';
        if (!newP[cat]) newP[cat] = 0;
        newP[cat] += m.total_custo;
      });
      return newP;
    });
  }, [empenhoTempo, viewMode, empenhoMaterial]);

  const categories = useMemo(() => {
    return empenhoCategoria.map((c) => c.categoria);
  }, [empenhoCategoria]);

  const rawPieData = viewMode === 'geral' ? empenhoCategoria : empenhoMaterial || [];
  const pieData = rawPieData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));
  
  const pieNameKey = viewMode === 'geral' ? 'categoria' : 'descricao';

  return (
    <div className="commitment-card charts-container bg-white border border-gray-200 rounded-lg p-6 relative shadow-sm">
          {/* Seletor Centralizado */}
      <div className="kpi-header flex justify-between items-start mb-6">
        <div className="kpi-card-highlight bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Gasto Total em Pedidos</p>
          <p className="text-2xl font-black text-blue-900">
            {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        {/* Seletor */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded shadow-sm px-3 py-1">
          <span className="text-sm text-gray-700">Empenho por:</span>
          <select
            className="bg-transparent border-none outline-none text-sm font-semibold cursor-pointer text-blue-600"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'geral' | 'categoria')}
          >
            <option value="geral">Geral</option>
            <option value="categoria">Material</option>
          </select>
        </div>
      </div>

      <div className="charts-display-wrapper flex flex-wrap gap-8 items-center justify-between">
                {/* Gráfico 1: Linhas (Custo empenhado) */}
        <div className="chart-item flex-1 min-w-[300px]">
          <p className="chart-label font-semibold mb-2 text-gray-700 ml-4">Evolução do Gasto</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={transformedTempo} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} />
              <XAxis dataKey="data" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
              <Legend verticalAlign="bottom" height={36} iconType="rect" />

              {viewMode === 'geral' ? (
                <Line type="linear" dataKey="total_custo" stroke="#0f4a8e" strokeWidth={3} name="Total Gasto" dot={{ r: 4 }} />
              ) : (
                categories.map((cat, index) => (
                  <Line key={cat} type="linear" dataKey={cat} stroke={COLORS[index % COLORS.length]} strokeWidth={3} name={cat} dot={{ r: 4 }} />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico 2: Rosca (Custo por categoria / material) */}
        <div className="chart-item flex-1 min-w-[300px]">
          <p className="chart-label font-semibold mb-2 text-center text-gray-700">
            {viewMode === 'geral' ? 'Custo por Categoria' : 'Distribuição por Material'}
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="total_custo"
                nameKey={pieNameKey}
                cx="50%" cy="50%"
                innerRadius={60} 
                outerRadius={80}
              />
              <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR')}`} />
              <Legend verticalAlign="bottom" height={36} iconType="square" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

            {/* Badge de Gasto Total Inferior */}
    </div>
  );
}