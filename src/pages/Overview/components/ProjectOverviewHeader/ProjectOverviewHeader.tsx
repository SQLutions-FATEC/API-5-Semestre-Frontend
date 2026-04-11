import { Calendar, PencilRuler, User, LayoutGrid, Clock, Info } from 'lucide-react';
import './ProjectOverviewHeader.scss';

interface ProjectOverviewHeaderProps {
  readonly programName?: string;
  readonly programCode?: string;
  readonly programManager?: string;
  readonly finishDate?: string;
  readonly projectName?: string;
  readonly projectCode?: string;
  readonly startDate?: string;
  readonly responsible?: string;
  readonly status?: string;
  readonly hasError?: boolean;
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
  hasError = false,
}: ProjectOverviewHeaderProps) {
  const calculateProgress = () => {
    if (hasError) return 0;
    const sDate = new Date(startDate);
    const eDate = new Date(finishDate.split('/').reverse().join('-'));
    const now = new Date();

    const total = eDate.getTime() - sDate.getTime();
    const elapsed = now.getTime() - sDate.getTime();

    const percent = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    return Math.round(percent);
  };

  const calculateElapsed = (start: string, finish: string) => {
    if (hasError) return '--';
    const sDate = new Date(start);
    const endDate = finish.includes('/')
      ? new Date(finish.split('/').reverse().join('-'))
      : new Date(finish);

    let months = (endDate.getFullYear() - sDate.getFullYear()) * 12;
    months -= sDate.getMonth();
    months += endDate.getMonth();

    let daysDiff = endDate.getDate() - sDate.getDate();
    if (daysDiff < 0) {
      months--;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      daysDiff += prevMonth.getDate();
    }

    if (months < 0) return 'Iniciando';

    const elapsedParts: string[] = [];

    if (months > 0) {
      elapsedParts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    }

    if (daysDiff > 0 || months === 0) {
      elapsedParts.push(`${daysDiff} ${daysDiff === 1 ? 'dia' : 'dias'}`);
    }

    return elapsedParts.join(' e ');
  };

  const elapsedText = calculateElapsed(startDate, finishDate);
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
                <span className="value">
                  {hasError ? '--' : new Date(startDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <div className="meta-compact">
              <Calendar size={16} className="meta-icon" />
              <div className="meta-text">
                <span className="label">Previsão:</span>
                <span className="value">{hasError ? '--' : finishDate}</span>
              </div>
            </div>
          </div>

          <div className="timeline-section">
            <div className="timeline-header">
              <div className="elapsed-info">
                <Clock size={16} className="icon" />
                <span className="text">{hasError ? '-- no total' : `${elapsedText} no total`}</span>
              </div>
              <span className="percent-label">
                {hasError ? '--%' : `${progressPercent}%`} concluído
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${hasError ? 0 : progressPercent}%` }}
              ></div>
            </div>
            <div className="timeline-footer">
              <span className="footer-label">Gerente: {programManager}</span>
              <div
                className="info-tooltip"
                title="Percentual baseado no tempo estimado vs decorrido"
              >
                <Info size={14} />
              </div>
            </div>
          </div>
        </div>

        {hasError && (
          <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-sm font-semibold">Informações do projeto indisponíveis</h2>
              <p className="text-xs mt-1">
                Não foi possível carregar as informações superiores, mas você ainda pode consultar
                os dados abaixo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
