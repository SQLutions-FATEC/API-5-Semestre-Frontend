import { useMemo, useState } from "react";
import ProjectOverviewHeader from "../Overview/components/ProjectOverviewHeader/ProjectOverviewHeader";
import CommitmentTab from "./components/CommitmentTab/CommitmentTab";
import CommitmentCharts from "./components/CommitmentCharts/CommitmentCharts";
import ObsoleteList from "./components/ObsoleteList/ObsoleteList";

export default function CommitmentMaterial() {
  const [categoria, setCategoria] = useState('todas');

  const materials = [
    {
      id: '1',
      nome: 'Cimento',
      categoria: 'Construção',
      quantidade_empenhada: 100,
      custo_unitario: 30,
      data_empenho: '2026-03-10',
      status: 'Ativo'
    },
    {
      id: '2',
      nome: 'Areia',
      categoria: 'Construção',
      quantidade_empenhada: 50,
      custo_unitario: 20,
      data_empenho: '2026-02-10',
      status: 'Obsoleto'
    }
  ];

  const categorias = [...new Set(materials.map(m => m.categoria))];

  const filtrados = useMemo(() => {
    if (categoria === 'todas') return materials;
    return materials.filter(m => m.categoria === categoria);
  }, [categoria]);

  const total = filtrados.reduce((acc, item) => {
    return acc + item.quantidade_empenhada * item.custo_unitario;
  }, 0);

  const obsoletos = filtrados.filter(m => m.status === 'Obsoleto');

return (
  <div className="commitment-page">
    <ProjectOverviewHeader />
    
    <div className="commitment-content">
      {/* Filtro */}
      <div className="commitment-card filter-wrapper">
        <span>Filtrar por Categoria: </span>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="todas">Todas as Categorias</option>
          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {/* Tabela de Empenho */}
      <CommitmentTab dados={filtrados} total={total} />

      {/* SEÇÃO ANALYTICS: Aqui o CSS fará a mágica de colocar lado a lado */}
      <div className="analytics-section">
        <CommitmentCharts dados={filtrados} categoriaSelecionada={categoria} />
        <ObsoleteList dados={obsoletos} />
      </div>
    </div>
  </div>
);
}