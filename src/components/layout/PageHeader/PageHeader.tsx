import type { ReactNode } from 'react';
import './PageHeader.scss';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export default function PageHeader({ icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-header-title">
        {icon}
        {title}
      </h1>
      <p className="page-header-subtitle">{subtitle}</p>
    </div>
  );
}
