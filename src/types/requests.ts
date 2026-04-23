export interface RequestMock {
  id: string;
  numero_solicitacao: string;
  numero_pedido: string | null;
  nome_material: string;
  data_solicitacao: string;
  valor_total_estimado: number;
  status: 'Aprovada' | 'Pendente' | 'Cancelada' | 'Rejeitada';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  dias_desde_criacao: number;
}
