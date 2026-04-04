import type { Material } from '../../../../types/commitment';
import './CommitmentTab.scss';

type Props = {
  data: Material[];
  total: number;
};

export default function CommitmentTab({ data, total }: Props) {
  return (
    <div className="commitment-card">
      <div className="card-header">
        <h2>Empenho de Materiais</h2>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th className="text-center">Quantidade</th>
              <th>Data</th>
              <th className="text-right">Custo</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              const Obsolete = item.status === 'Obsoleto';
              return (
                <tr key={item.id} className={Obsolete ? 'row-obsolete' : ''}>
                  <td className="font-bold">{item.name}</td>
                  <td>{item.category}</td>
                  <td className="text-center">{item.amount_committed}</td>
                  <td>{new Date(item.commitment_date).toLocaleDateString('pt-BR')}</td>
                  <td className="text-right font-mono">
                    {(item.amount_committed * item.unit_cost).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
 <tr className="total-row">
  <td colSpan={4} className="total-label">Custo Total Empenhado</td>
  <td className="text-right total-value">
    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
  </td>
</tr>
</tfoot>
        </table>
      </div>
    </div>
  );
}