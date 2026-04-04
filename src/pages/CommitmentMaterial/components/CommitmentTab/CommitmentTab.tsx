import type { Material } from '../../../../types/commitment';
import './CommitmentTab.scss';

type Props = {
  dados: Material[];
  total: number;
};

export default function CommitmentTab({ dados, total }: Props) {
  return (
    <div className="commitment-card">
      <div className="card-header">
        <h2>Tabela de Empenho</h2>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th className="text-center">Qtd</th>
              <th>Data</th>
              <th className="text-right">Custo</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(item => {
              const isObsoleto = item.status === 'Obsoleto';
              return (
                <tr key={item.id} className={isObsoleto ? 'row-obsolete' : ''}>
                  <td className="font-bold">{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td className="text-center">{item.quantidade_empenhada}</td>
                  <td>{new Date(item.data_empenho).toLocaleDateString('pt-BR')}</td>
                  <td className="text-right font-mono">
                    {(item.quantidade_empenhada * item.custo_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
  <tr className="total-row">
    {/* Ocupa 4 colunas para empurrar o valor para a última */}
    <td colSpan={4} style={{ textAlign: 'left', fontWeight: 'bold' }}>
      Custo Total Empenhado
    </td>
    <td className="text-right" style={{ fontWeight: '800', color: '#0f172a' }}>
      {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </td>
  </tr>
</tfoot>
        </table>
      </div>
    </div>
  );
}