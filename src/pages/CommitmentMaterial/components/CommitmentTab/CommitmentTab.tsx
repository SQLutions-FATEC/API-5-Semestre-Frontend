import './CommitmentTab.scss';

// Tipagem baseada nos dados cruzados que vamos enviar da página pai
type MaterialTabela = {
  codigo_material: string;
  descricao: string;
  categoria: string;
  fornecedor: string;
  quantidade_total: number;
  total_custo: number;
  isObsoleto: boolean; // Flag que usaremos para pintar de vermelho
};

type Props = {
  readonly data: MaterialTabela[];
};

export default function CommitmentTab({ data }: Props) {
  return (
    <div className="commitment-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-x-auto mt-6">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-gray-300 text-gray-600 uppercase text-[11px] tracking-wider">
            <th className="pb-3 font-bold">Cód</th>
            <th className="pb-3 font-bold">Material</th>
            <th className="pb-3 font-bold">Fornecedor</th>
            <th className="pb-3 font-bold text-right">Valor</th>
            <th className="pb-3 font-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.codigo_material}
                // LÓGICA DA COR: Se for obsoleto, aplica as classes vermelhas do Tailwind
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  item.isObsoleto ? 'bg-red-50/30' : ''
                }`}
              >
                <td className="py-4 text-gray-500 font-mono">{item.codigo_material}</td>
                <td className="py-4 font-semibold text-gray-800">{item.descricao}</td>
                <td className="py-4 text-gray-600">{item.fornecedor || '---'}</td>
                <td className="py-4 text-right font-bold">
                  {item.total_custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="py-4 text-center">
                  <span className={`status-badge ${item.isObsoleto ? 'obsoleto' : 'ativo'}`}>
                    {item.isObsoleto ? 'Obsoleto' : 'Ativo'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                Nenhum empenho encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
