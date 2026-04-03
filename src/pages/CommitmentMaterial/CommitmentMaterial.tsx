import './CommitmentMaterial.scss';
import { useMemo, useState } from 'react';

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
      
      <div className="card">
        <h2>Filtro</h2>

        <select onChange={(e) => setCategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {categorias.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <h2>Tabela de Empenho</h2>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Qtd</th>
              <th>Data</th>
              <th>Custo</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map(item => (
              <tr key={item.id}>
                <td>{item.nome}</td>
                <td>{item.categoria}</td>
                <td>{item.quantidade_empenhada}</td>
                <td>{item.data_empenho}</td>
                <td>{item.quantidade_empenhada * item.custo_unitario}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan={4}>Total</td>
              <td>{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="card">
        <h2>Materiais Obsoletos</h2>

        {obsoletos.length === 0 ? (
          <p>Nenhum material obsoleto</p>
        ) : (
          obsoletos.map(item => (
            <p key={item.id} className="old">
              ⚠️ {item.nome}
            </p>
          ))
        )}
      </div>

    </div>
  );
}