import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../services/commitmentService';
import './CommitmentCharts.scss';

type Props = {
  empenhoCategoria: EmpenhoCategoria[];
  empenhoTempo: EmpenhoTempo[];
  total: number;
};

// Cores baseadas no mockup para o gráfico de rosca
const COLORS = ['#0f4a8e', '#facc15', '#ea580c', '#10b981', '#8b5cf6'];

export default function CommitmentCharts({ empenhoCategoria, empenhoTempo, total }: Props) {
  return (
    <div className="commitment-card charts-container bg-white border border-gray-200 rounded-lg p-6 relative shadow-sm">

      {/* Seletor Centralizado */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded shadow-sm px-3 py-1">
          <span className="text-sm text-gray-700">Empenho geral</span>
          <select className="bg-transparent border-none outline-none text-sm font-semibold cursor-pointer text-blue-600">
            <option>Geral</option>
            <option>Categoria</option>
          </select>
        </div>
      </div>

      <div className="charts-display-wrapper flex flex-wrap gap-8 items-center justify-between">

        {/* Gráfico 1: Linhas (Custo empenhado) */}
        <div className="chart-item flex-1 min-w-[300px]">
          <p className="chart-label font-semibold mb-2 text-gray-700 ml-4">Custo empenhado</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={empenhoTempo} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} />
              <XAxis dataKey="data" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend verticalAlign="bottom" height={36} iconType="rect" />
              {/* CORREÇÃO AQUI: removido o shape: 'square' do objeto dot */}
              <Line
                type="linear"
                dataKey="total_custo"
                stroke="#0f4a8e"
                strokeWidth={3}
                name="Total_gasto"
                dot={{ stroke: '#0f4a8e', strokeWidth: 2, fill: '#0f4a8e', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Rosca (Custo por categoria) */}
        <div className="chart-item flex-1 min-w-[300px]">
          <p className="chart-label font-semibold mb-2 text-center text-gray-700">Custo por categoria</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={empenhoCategoria}
                dataKey="total_custo"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
              >
                {empenhoCategoria.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend verticalAlign="bottom" height={36} iconType="square" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badge de Gasto Total Inferior */}
      <div className="flex justify-center mt-2 relative z-10">
        <div className="bg-[#e0f2fe] text-[#0369a1] px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-[#bae6fd]">
          <span className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs"></span>
          Gasto total: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </div>
      </div>
    </div>
  );
}