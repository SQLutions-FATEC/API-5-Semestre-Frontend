import { useMemo, useState } from 'react';
import CommitmentCharts from '../CommitmentCharts/CommitmentCharts';
import ObsoleteList from '../ObsoleteList/ObsoleteList';
import type { Material } from '../../../../types/commitment';

type Props = {
  dados: Material[];
  total: number;
};

export default function CommitmentTab({  }: Props) {
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
    <>
      {/* Filtro */}
      <div className="card">
        <h2>Filtro</h2>

        <select onChange={(e) => setCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {categorias.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Gráficos */}
      <CommitmentCharts dados={filtrados} />

      {/* Obsoletos */}
      <ObsoleteList dados={obsoletos} />
    </>
  );
}