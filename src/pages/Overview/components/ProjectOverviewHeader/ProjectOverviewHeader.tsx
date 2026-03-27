import { Calendar, PencilRuler, User, LayoutGrid, Clock, Info } from 'lucide-react';
import './ProjectOverviewHeader.scss';

interface ProjectOverviewHeaderProps {
  programName?: string;
  programCode?: string;
  programManager?: string;
  finishDate?: string;
  projectName?: string;
  projectCode?: string;
  startDate?: string;
  responsible?: string;
  status?: string;
}

export default function ProjectOverviewHeader({
  programName = 'MAX 1.2 AC',
  programCode = 'MAX12AC',
  programManager = 'Ana Paula Ribeiro',
  finishDate = '30/01/2027',
  projectName = 'Conversor DC-DC Isolado',
  projectCode = 'PRJ001',
  startDate = '2024-06-27',
  responsible = 'Felipe Rocha',
  status = 'Em andamento',
}: ProjectOverviewHeaderProps) {

  const calculateProgress = () => {
    const sDate = new Date(startDate);
    const eDate = new Date(finishDate.split('/').reverse().join('-'));
    const now = new Date();

    const total = eDate.getTime() - sDate.getTime();
    const elapsed = now.getTime() - sDate.getTime();

    const percent = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(percent);
  };

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

    if (months < 0) return 'Iniciando';

    return `${months} meses e ${daysDiff} dias`;
  };

  const elapsedText = calculateElapsed(startDate);
  const progressPercent = calculateProgress();

  return (
    <div className="unified-project-header">

      <div className="header-main-surface">
        <div className="program-context-section">
          <div className="program-info">
            <LayoutGrid size={22} className="icon" />
            <div className="text-group">
              <span className="label">Programa</span>
              <div className="name-row">
                <span className="name">{programName}</span>
                <span className="code">{programCode}</span>
              </div>
            </div>
          </div>
          <div className="status-pill-container">
            <div className="status-indicator"></div>
            <span className="status-label">{status}</span>
          </div>
        </div>

        <div className="divider-line"></div>

        <div className="title-section">
          <div className="project-icon-box">
            <PencilRuler size={32} />
          </div>
          <div className="project-title-group">
            <span className="project-label">Projeto</span>
            <div className="project-identity">
              <h1 className="project-name">{projectName}</h1>
              <span className="project-id">{projectCode}</span>
            </div>
          </div>
          <div className="responsible-box">
            <div className="responsible-circle">
              <User size={18} />
            </div>
            <div className="responsible-text">
              <span className="label">Responsável</span>
              <span className="value">{responsible}</span>
            </div>
          </div>
        </div>

        <div className="divider-line"></div>

        <div className="header-info-grid">
          <div className="info-column">
            <div className="meta-compact">
              <Calendar size={16} className="meta-icon" />
              <div className="meta-text">
                <span className="label">Início:</span>
                <span className="value">{new Date(startDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="meta-compact">
              <Calendar size={16} className="meta-icon" />
              <div className="meta-text">
                <span className="label">Previsão:</span>
                <span className="value">{finishDate}</span>
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <div className="timeline-header">
              <div className="elapsed-info">
                <Clock size={16} className="icon" />
                <span className="text">{elapsedText} decorridos</span>
              </div>
              <span className="percent-label">{progressPercent}% concluído</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="timeline-footer">
              <span className="footer-label">Gerente: {programManager}</span>
              <div className="info-tooltip" title="Percentual baseado no tempo estimado vs decorrido">
                <Info size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
