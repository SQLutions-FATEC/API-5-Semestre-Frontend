import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import './PageHeader.scss';

interface PageHeaderProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly subtitle: string;
  readonly backTo?: string;
}

export default function PageHeader({ icon, title, subtitle, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <div className="page-header-top">
        {backTo && (
          <button
            className="back-button"
            onClick={() => navigate(backTo)}
            aria-label="Voltar"
            title="Voltar"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="page-header-title">
          {icon}
          {title}
        </h1>
      </div>
      <p className="page-header-subtitle" style={backTo ? { marginLeft: '2.75rem' } : {}}>
        {subtitle}
      </p>
    </div>
  );
}
