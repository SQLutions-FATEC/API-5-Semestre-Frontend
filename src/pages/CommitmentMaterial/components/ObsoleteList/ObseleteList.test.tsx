import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ObsoleteList from './ObsoleteList';

const mockObsoletos = [
  {
    id: '1',
    name: 'Sensor ACS712',
    category: 'Sensor',
    amount_committed: 10,
    unit_cost: 5,
    commitment_date: '2026-01-01',
    status: 'Obsoleto'
  }
];

describe('ObsoleteList Component', () => {
  it('deve renderizar a lista de materiais obsoletos corretamente', () => {
    render(<ObsoleteList data={mockObsoletos} />);
    
    expect(screen.getByText('Sensor ACS712')).toBeDefined();
    expect(screen.getByText('⚠️')).toBeDefined();
  });

  it('deve exibir mensagem de lista vazia quando não houver dados', () => {
    render(<ObsoleteList data={[]} />);
    
    expect(screen.getByText('Nenhum material obsoleto encontrado.')).toBeDefined();
  });
});