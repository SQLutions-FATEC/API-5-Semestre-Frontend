import './CommitmentTab.scss';

// Tipagem baseada nos dados cruzados que vamos enviar da página pai
type MaterialTabela = {
    codigo_material: string;
    descricao: string;
    categoria: string;
    quantidade_total: number;
    total_custo: number;
    isObsoleto: boolean; // Flag que usaremos para pintar de vermelho
};

type Props = {
    data: MaterialTabela[];
};

export default function CommitmentTab({ data }: Props) {
    return (
        <div className="commitment-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm overflow-x-auto mt-6">
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="border-b border-gray-300 text-gray-600">
                        <th className="pb-3 font-medium">Código</th>
                        <th className="pb-3 font-medium">Nome do material</th>
                        <th className="pb-3 font-medium">Categoria</th>
                        <th className="pb-3 font-medium text-center">Quantidade</th>
                        <th className="pb-3 font-medium text-right">Total Gasto</th>
                        <th className="pb-3 font-medium text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={item.codigo_material}
                                // LÓGICA DA COR: Se for obsoleto, aplica as classes vermelhas do Tailwind
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${item.isObsoleto ? 'text-red-600 font-medium bg-red-50/40' : 'text-gray-800'
                                    }`}
                            >
                                <td className="py-3 pl-2">{item.codigo_material}</td>
                                <td className="py-3">{item.descricao}</td>
                                <td className="py-3">{item.categoria}</td>
                                <td className="py-3 text-center">{item.quantidade_total}</td>
                                <td className="py-3 text-right">
                                    {item.total_custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </td>
                                <td className={`py-3 text-center font-bold ${item.isObsoleto ? 'text-red-600' : 'text-green-600'}`}>
                                    {item.isObsoleto ? 'Obsoleto' : 'Ativo'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-500">Nenhum empenho encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}