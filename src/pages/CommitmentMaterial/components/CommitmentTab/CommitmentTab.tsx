import type { Material } from '../../../../types/commitment';

type Props = {
  dados: Material[];
  total: number;
};

export default function CommitmentTab({ dados, total }: Props) {
  return (
    <div className="card">
      <h2>Tabela de Empenho</h2>

      <table className="table">
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
    {dados.map(item => {
      const custo = item.quantidade_empenhada * item.custo_unitario;

      return (
        <tr
          key={item.id}
          className={item.status === 'Obsoleto' ? 'row-obsolete' : ''}
        >
          <td>{item.nome}</td>
          <td>{item.categoria}</td>
          <td>{item.quantidade_empenhada}</td>
          <td>{item.data_empenho}</td>
          <td>R$ {custo}</td>
        </tr>
      );
    })}
  </tbody>

  <tfoot>
    <tr>
      <td colSpan={4}>Total</td>
      <td>R$ {total}</td>
    </tr>
  </tfoot>
</table>
    </div>
  );
}