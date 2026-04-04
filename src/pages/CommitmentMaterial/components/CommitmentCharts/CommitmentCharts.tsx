import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { Material } from '../../../../types/commitment';


type Props = {
  dados: Material[];
  categoriaSelecionada: string; // 👈 ADICIONA ISSO
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function CommitmentCharts({ dados, categoriaSelecionada }: Props) {

  // 📊 Agrupar por categoria
  const porCategoria = Object.values(
    dados.reduce<Record<string, { name: string; value: number }>>((acc, item) => {
      const custo = item.quantidade_empenhada * item.custo_unitario;

      if (!acc[item.categoria]) {
        acc[item.categoria] = { name: item.categoria, value: 0 };
      }

      acc[item.categoria].value += custo;
      return acc;
    }, {})
  );

  // 📊 Por material (direto)
  const porMaterial = dados.map(item => ({
    name: item.nome,
    value: item.quantidade_empenhada * item.custo_unitario
  }));

  // 🎯 Verifica se está filtrado (somente 1 categoria)
  const isFiltrado = new Set(dados.map(d => d.categoria)).size === 1;

  return (
    <div className="card">
      <h2>Analytics</h2>

      <div className="charts-container">

        {/* 🔵 POR CATEGORIA */}
{categoriaSelecionada !== 'todas' && (
  <div className="chart-box">
    <h3>Por Material</h3>
    ...
  </div>
)}

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={porCategoria}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
              >
                {porCategoria.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => `R$ ${value}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 POR MATERIAL (APENAS SE FILTRADO) */}
        {isFiltrado && (
          <div className="chart-box">
            <h3>Por Material</h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={porMaterial}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={90}
                >
                  {porMaterial.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
  );
}