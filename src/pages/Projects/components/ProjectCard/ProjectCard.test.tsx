import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import type { ProjectListItem } from '../../../../types/project';

const mockProject: ProjectListItem = {
  codigo: 'PRJ-123',
  nome: 'Projeto de Teste',
  responsavel: 'João',
  status: 'Ativo',
};

describe('ProjectCard Component', () => {
  it('deve renderizar as informações do projeto corretamente', () => {
    render(<ProjectCard project={mockProject} onClick={() => {}} />);

    expect(screen.getByText('Projeto de Teste')).toBeInTheDocument();
    expect(screen.getByText('PRJ-123')).toBeInTheDocument();
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('deve chamar a função onClick passando o código do projeto ao ser clicado', () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);

    const cardElement = screen.getByText('Projeto de Teste').closest('.project-card');
    if (cardElement) {
      fireEvent.click(cardElement);
    }

    expect(handleClick).toHaveBeenCalledWith('PRJ-123');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
