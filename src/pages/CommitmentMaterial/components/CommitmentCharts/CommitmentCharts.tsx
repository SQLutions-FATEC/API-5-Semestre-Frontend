import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import type { Material } from '../../../../types/commitment';

type Props = {
  dados: Material[];
};

export default function CommitmentCharts({ dados }: Props) {

  // 📊 Custo por categoria
  const custoPorCategoria = Object.values(
    dados.reduce((acc: any, item: any) => {
      const custo = item.quantidade_empenhada * item.custo_unitario;

      if (!acc[item.categoria]) {
        acc[item.categoria] = { categoria: item.categoria, total: 0 };
      }

      acc[item.categoria].total += custo;
      return acc;
    }, {})
  );

  // 📊 Comparação mensal
  const hoje = new Date();

  const custoMesAtual = dados
    .filter((m: any) => new Date(m.data_empenho).getMonth() === hoje.getMonth())
    .reduce((acc: number, m: any) => acc + m.quantidade_empenhada * m.custo_unitario, 0);

  const custoMesAnterior = dados
    .filter((m: any) => new Date(m.data_empenho).getMonth() === hoje.getMonth() - 1)
    .reduce((acc: number, m: any) => acc + m.quantidade_empenhada * m.custo_unitario, 0);

  const comparacao = [
    { nome: 'Atual', valor: custoMesAtual },
    { nome: 'Anterior', valor: custoMesAnterior }
  ];

  return (
    <div className="card">
      <h2>Analytics</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Gráfico 1 */}
        <div style={{ width: '50%', height: 300 }}>
          <h4>Custo por Categoria</h4>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={custoPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2 */}
        <div style={{ width: '50%', height: 300 }}>
          <h4>Comparação Mensal</h4>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}