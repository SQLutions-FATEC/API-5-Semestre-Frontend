import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgramCard from './ProgramCard';
import type { ProgramListItem } from '../../../../types/project';

const mockProgram: ProgramListItem = {
  codigo: 'MANSUP-001',
  nome: 'Programa de Manutenção e Suporte',
  gerente: 'Carlos Eduardo Martinho',
  gerente_tecnico: 'Rafael Carvalho',
  status: 'Ativo',
};

describe('ProgramCard Component', () => {
  it('deve renderizar as informações do programa corretamente', () => {
    render(<ProgramCard program={mockProgram} />);

    expect(screen.getByText('Programa de Manutenção e Suporte')).toBeInTheDocument();
    expect(screen.getByText('MANSUP-001')).toBeInTheDocument();

    expect(screen.getByText(/Carlos Eduardo Martinho/i)).toBeInTheDocument();
    expect(screen.getByText(/Rafael Carvalho/i)).toBeInTheDocument();

    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('deve aplicar as classes de CSS corretas para o status', () => {
    const { container } = render(<ProgramCard program={mockProgram} />);
    
    const indicator = container.querySelector('.status-indicator');
    expect(indicator).toHaveClass('status-ativo');

    const badge = screen.getByText('Ativo');
    expect(badge).toHaveClass('badge-ativo');
  });
});