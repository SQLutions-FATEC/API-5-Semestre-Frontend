import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CommitmentTab from './CommitmentTab';

const mockData = [
    {
        codigo_material: 'MAT001',
        descricao: 'Item Ativo',
        categoria: 'Cat A',
        quantidade_total: 2,
        total_custo: 50,
        isObsoleto: false // Ativo
    },
    {
        codigo_material: 'MAT002',
        descricao: 'Item Obsoleto',
        categoria: 'Cat B',
        quantidade_total: 1,
        total_custo: 200,
        isObsoleto: true // Obsoleto
    }
];

describe('CommitmentTab Component', () => {
    it('deve renderizar a tabela com os dados corretos', () => {
        render(<CommitmentTab data={mockData} />);

        expect(screen.getByText('MAT001')).toBeDefined();
        expect(screen.getByText('Item Ativo')).toBeDefined();

        expect(screen.getByText('MAT002')).toBeDefined();
        expect(screen.getByText('Item Obsoleto')).toBeDefined();
    });

    it('deve marcar o item corretamente como Obsoleto ou Ativo na coluna de status', () => {
        render(<CommitmentTab data={mockData} />);

        // Um item deve exibir "Ativo" e o outro "Obsoleto"
        expect(screen.getByText('Ativo')).toBeDefined();
        expect(screen.getByText('Obsoleto')).toBeDefined();
    });

    it('deve exibir mensagem de tabela vazia quando não houver dados', () => {
        render(<CommitmentTab data={[]} />);

        expect(screen.getByText('Nenhum empenho encontrado.')).toBeDefined();
    });
});