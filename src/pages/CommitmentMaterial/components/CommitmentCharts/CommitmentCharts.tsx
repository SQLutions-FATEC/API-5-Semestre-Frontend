import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Material } from '../../../../types/commitment';
import './CommitmentCharts.scss';

type Props = {
  dados: Material[];
  categoriaSelecionada: string;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function CommitmentCharts({ dados, categoriaSelecionada }: Props) {
  
  // 1. Dados para o gráfico de CATEGORIAS (Sempre visível)
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

  // 2. Dados para o gráfico de MATERIAIS
  const porMaterial = dados.map(item => ({
    name: item.nome,
    value: item.quantidade_empenhada * item.custo_unitario
  }));

  // US-1: Mostrar segundo gráfico apenas se o filtro de categoria estiver ligado
  const mostrarSegundoGrafico = true;

  return (
    <div className="commitment-card">
      <div className="card-header">
        <h2>Analytics de Custos</h2>
      </div>
      
      <div className="charts-display-wrapper">
        {/* GRÁFICO 1: POR CATEGORIA */}
        <div className="chart-item">
          <p className="chart-label">Custo Total por Categoria</p>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={porCategoria}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {porCategoria.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: POR MATERIAL (Condicional) */}
        {mostrarSegundoGrafico && (
          <div className="chart-item">
            <p className="chart-label">Materiais em: {categoriaSelecionada}</p>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={porMaterial}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {porMaterial.map((_, index) => (
                      <Cell key={index} fill={COLORS[(index + 1) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}