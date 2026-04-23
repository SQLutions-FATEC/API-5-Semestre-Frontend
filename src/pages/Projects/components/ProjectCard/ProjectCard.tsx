import React from 'react';
import { User, Code } from 'lucide-react';
import './ProjectCard.scss';
import type { ProjectListItem } from '../../../../types/project';

interface ProjectCardProps {
  project: ProjectListItem;
  onClick: (codigo: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(project.codigo);
    }
  };

  return (
    <div
      className="project-card"
      onClick={() => onClick(project.codigo)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={`status-indicator status-${project.status.toLowerCase()}`} />
      <div className="project-card-content">
        <h3 className="project-title">{project.nome}</h3>
        <div className="project-info">
          <span>
            <Code size={14} /> {project.codigo}
          </span>
          <span>
            <User size={14} /> {project.responsavel}
          </span>
        </div>
        <span className={`status-badge badge-${project.status.toLowerCase()}`}>
          {project.status}
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
