import { useMemo, useState } from "react";
import ProjectOverviewHeader from "../Overview/components/ProjectOverviewHeader/ProjectOverviewHeader";
import CommitmentTab from "./components/CommitmentTab/CommitmentTab";
import CommitmentCharts from "./components/CommitmentCharts/CommitmentCharts";
import ObsoleteList from "./components/ObsoleteList/ObsoleteList";
import './CommitmentMaterial.scss';

export default function CommitmentMaterial() {
  const [category, setCategory] = useState('todas');

  const materials = [
  {
    id: '1',
    name: 'Microcontrolador ARM Cortex-M4',
    category: 'Processador',
    amount_committed: 75,
    unit_cost: 30,
    commitment_date: '2026-03-10',
    status: 'Ativo'
  },
  {
    id: '2',
    name: 'Sensor Corrente ACS712',
    category: 'Sensor',
    amount_committed: 50,
    unit_cost: 20,
    commitment_date: '2026-02-10',
    status: 'Obsoleto'
  },
  {
    id: '3',
    name: 'Capacitor Cerâmico 10uF 0603',
    category: 'Capacitor',
    amount_committed: 150,
    unit_cost: 0.50,
    commitment_date: '2026-01-15',
    status: 'Ativo'
  },
  {
    id: '4',
    name: 'Relé 12V 5A DPDT',
    category: 'Relé',
    amount_committed: 25,
    unit_cost: 15,
    commitment_date: '2026-03-05',
    status: 'Obsoleto'
  }
];

  const categorias = [...new Set(materials.map(m => m.category))];

  const filtrados = useMemo(() => {
    return category === 'todas' 
      ? materials 
      : materials.filter(m => m.category === category);
  }, [category, materials]);

  const total = useMemo(() => 
    filtrados.reduce((acc, item) => acc + (item.amount_committed * item.unit_cost), 0)
  , [filtrados]);

  const obsoletos = useMemo(() => 
    filtrados.filter(m => m.status === 'Obsoleto')
  , [filtrados]);

  return (
    <div className="commitment-page">
      <ProjectOverviewHeader />
      <div className="commitment-content">
        <CommitmentTab data={filtrados} total={total} />
        
        <div className="commitment-card filter-wrapper">
          <div className="filter-group">
            <label>Filtrar por Categoria:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="todas">Todas as Categorias</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="analytics-section">
          <CommitmentCharts 
            allData={materials} 
            filteredData={filtrados} 
            selectedCategory={category} 
          />
          <ObsoleteList data={obsoletos} />
        </div>
      </div>
    </div>
  );
}