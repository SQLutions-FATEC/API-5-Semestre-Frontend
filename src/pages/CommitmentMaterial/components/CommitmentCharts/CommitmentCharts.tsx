import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../../../services/commitmentService';
import './CommitmentCharts.scss';

type Props = {
  empenhoCategoria: EmpenhoCategoria[];
  empenhoTempo: EmpenhoTempo[];
};

export default function CommitmentCharts({ empenhoCategoria, empenhoTempo }: Props) {
  return (
    <div className="commitment-card charts-container">
      <div className="card-header">
        <h2>Análise de Custos e Empenhos</h2>
      </div>

      {/* Container flex para deixar os gráficos lado a lado em telas grandes */}
      <div className="charts-display-wrapper" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>

        {/* Gráfico 1: Barras - Custo por Categoria */}
        <div className="chart-item" style={{ flex: 1, minWidth: '300px' }}>
          <p className="chart-label font-semibold mb-4 text-center">Custo por Categoria</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={empenhoCategoria} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {/* tick={{fontSize: 12}} ajuda a não encavalar os nomes das categorias */}
              <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Bar dataKey="total_custo" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Custo Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Linhas - Evolução do Empenho */}
        <div className="chart-item" style={{ flex: 1, minWidth: '300px' }}>
          <p className="chart-label font-semibold mb-4 text-center">Evolução do Empenho</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={empenhoTempo} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="data" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(val: any) => `R$ ${Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                labelStyle={{ color: '#333', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="total_custo" stroke="#10b981" strokeWidth={3} name="Empenho Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}