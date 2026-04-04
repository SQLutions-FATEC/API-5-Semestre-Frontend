import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommitmentTab from './CommitmentTab';

const mockData = [
  {
    id: '1',
    name: 'Item Ativo',
    category: 'Cat A',
    amount_committed: 2,
    unit_cost: 50,
    commitment_date: '2026-03-10',
    status: 'Ativo'
  },
  {
    id: '2',
    name: 'Item Obsoleto',
    category: 'Cat B',
    amount_committed: 1,
    unit_cost: 200,
    commitment_date: '2026-03-10',
    status: 'Obsoleto'
  }
];

describe('CommitmentTab Component', () => {
  it('deve renderizar a tabela com os dados e o custo total em BRL', () => {
    render(<CommitmentTab data={mockData} total={300} />);

    expect(screen.getByText('Item Ativo')).toBeDefined();

    expect(screen.getByText(/300,00/)).toBeDefined();
  });

  it('deve aplicar a classe "row-obsolete" apenas em itens obsoletos', () => {
    const { container } = render(<CommitmentTab data={mockData} total={300} />);
    
    const rows = container.querySelectorAll('tr');

    expect(rows[2].classList.contains('row-obsolete')).toBe(true);
    expect(rows[1].classList.contains('row-obsolete')).toBe(false);
  });
});