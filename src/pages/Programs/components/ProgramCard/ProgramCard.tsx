import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Code } from 'lucide-react';
import type { ProgramListItem } from '../../../../types/project';
import './ProgramCard.scss';

interface ProgramCardProps {
  program: ProgramListItem;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="program-card" 
      onClick={() => navigate(`/programas/${program.codigo}/projetos`)}
      style={{ cursor: 'pointer' }}
    >
      <div className={`status-indicator status-${program.status.toLowerCase()}`} />
      <div className="program-card-content">
        <h3 className="program-title">{program.nome}</h3>
        
        <div className="program-info">
          <span>
            <Code size={14} /> {program.codigo}
          </span>
          <span>
            <User size={14} /> <strong>Gerente:</strong> {program.gerente}
          </span>
          <span>
            <Users size={14} /> <strong>Técnico:</strong> {program.gerente_tecnico}
          </span>
        </div>

        <span className={`status-badge badge-${program.status.toLowerCase()}`}>
          {program.status}
        </span>
      </div>
    </div>
  );
};

export default ProgramCard;