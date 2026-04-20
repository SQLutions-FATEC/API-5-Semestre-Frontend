import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CommitmentTab from './CommitmentTab';

// Mock de dados atualizado com o campo 'fornecedor' exigido pela nova tipagem
const mockData = [
  {
    codigo_material: 'MAT001',
    descricao: 'Item Ativo',
    categoria: 'Cat A',
    fornecedor: 'Fornecedor Alpha',
    quantidade_total: 2,
    total_custo: 50.00,
    isObsoleto: false,
  },
  {
    codigo_material: 'MAT002',
    descricao: 'Item Obsoleto',
    categoria: 'Cat B',
    fornecedor: 'Fornecedor Beta',
    quantidade_total: 1,
    total_custo: 200.00,
    isObsoleto: true,
  },
];

describe('CommitmentTab Component', () => {
  it('deve renderizar os cabeçalhos corretos da tabela', () => {
    render(<CommitmentTab data={mockData} />);
    
    expect(screen.getByText('Cód')).toBeDefined();
    expect(screen.getByText('Material')).toBeDefined();
    expect(screen.getByText('Fornecedor')).toBeDefined();
    expect(screen.getByText('Valor')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
  });

  it('deve renderizar as linhas com os dados de materiais e fornecedores', () => {
    render(<CommitmentTab data={mockData} />);

    // Verifica Cód e Descrição
    expect(screen.getByText('MAT001')).toBeDefined();
    expect(screen.getByText('Item Ativo')).toBeDefined();
    
    // Verifica Fornecedor (Nova coluna)
    expect(screen.getByText('Fornecedor Alpha')).toBeDefined();
    expect(screen.getByText('Fornecedor Beta')).toBeDefined();

    // Verifica formatação de Valor (moeda brasileira)
    expect(screen.getByText('R$ 50,00')).toBeDefined();
    expect(screen.getByText('R$ 200,00')).toBeDefined();
  });

  it('deve marcar o item corretamente como Obsoleto ou Ativo na coluna de status', () => {
    render(<CommitmentTab data={mockData} />);

    const statusAtivo = screen.getByText('Ativo');
    const statusObsoleto = screen.getByText('Obsoleto');

    expect(statusAtivo).toBeDefined();
    expect(statusObsoleto).toBeDefined();

    // Verifica se as classes de estilo estão presentes (opcional, mas bom para garantir o visual)
    expect(statusAtivo.className).toContain('ativo');
    expect(statusObsoleto.className).toContain('obsoleto');
  });

  it('deve exibir mensagem de tabela vazia quando não houver dados', () => {
    render(<CommitmentTab data={[]} />);

    expect(screen.getByText('Nenhum empenho encontrado.')).toBeDefined();
  });
});