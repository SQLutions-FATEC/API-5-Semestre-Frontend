import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './ProjectOverviewHeader.scss';
import OverviewMetrics from '../OverviewMetrics/OverviewMetrics';

interface ProjectOverviewHeaderProps {
  programName?: string;
  projectName?: string;
  projectCode?: string;
  startDate?: string;
  responsible?: string;
  status?: string;
}

export default function ProjectOverviewHeader({
  programName = 'MAX 1.2 AC',
  projectName = 'Conversor DC-DC Isolado',
  projectCode = 'PRJ001',
  startDate = '2024-06-27',
  responsible = 'Felipe Rocha',
  status = 'Ativo',
}: ProjectOverviewHeaderProps) {

  const [isExpanded, setIsExpanded] = useState(true);

  const calculateElapsed = (start: string) => {
    const sDate = new Date(start);
    const now = new Date();

    let months = (now.getFullYear() - sDate.getFullYear()) * 12;
    months -= sDate.getMonth();
    months += now.getMonth();

    let daysDiff = now.getDate() - sDate.getDate();
    if (daysDiff < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      daysDiff += prevMonth.getDate();
    }

    if (months < 0) return '0 meses e 0 dias';

    return `${months} meses e ${daysDiff} dias`;
  };

  const elapsed = calculateElapsed(startDate);

  return (
    <div className="project-overview-header">

      <div 
        className="program-highlight-badge" 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
        title={isExpanded ? "Ocultar detalhes" : "Mostrar detalhes"}
      >
        <Briefcase size={20} className="badge-icon" />
        <span className="badge-label">Programa:</span>
        <span className="badge-text">{programName}</span>
        {isExpanded ? (
          <ChevronUp size={20} className="badge-chevron" />
        ) : (
          <ChevronDown size={20} className="badge-chevron" />
        )}
      </div>

      {/* Project Details Card */}
      <div className={`project-details-card ${!isExpanded ? 'collapsed' : ''}`}>
        <div className="project-details-content-wrapper">
          <div className="project-details-inner">
            <div className="details-header-row">
              <div className="project-name-group">
                <span className="label">Nome</span>
                <span className="value-large">{projectName}</span>
              </div>
              <div className="project-code-group">
                <span className="label">Cod:</span>
                <span className="value-code">{projectCode}</span>
              </div>
            </div>

            <div className="details-grid">
              {/* Left Column */}
              <div className="grid-column">
                <div className="detail-item">
                  <span className="label">Iniciado:</span>
                  <span className="value-medium">{new Date(startDate).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="detail-item spacing-top">
                  <span className="label">Tempo decorrido:</span>
                  <span className="value-medium">{elapsed}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="grid-column right-align">
                <div className="detail-item">
                  <span className="label">Responsavel:</span>
                  <span className="value-medium">{responsible}</span>
                </div>

                <div className="detail-item spacing-top">
                  <span className="label">Status:</span>
                  <span className="value-medium">{status}</span>
                </div>
              </div>
            </div>

            <hr className="section-divider" />

            <OverviewMetrics />
          </div>
        </div>
      </div>
    </div>
  );
}
