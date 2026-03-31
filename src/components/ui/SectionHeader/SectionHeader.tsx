import React from 'react';
import type { ReactNode } from 'react';
import './SectionHeader.scss';

interface SectionHeaderProps {
  title: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, label, icon, className = '' }) => {
  return (
    <div className={`section-header-container ${className}`}>
      <div className="accent-bar" />
      <div className="header-content">
        {label && <span className="category-label">{label}</span>}
        <div className="title-wrapper">
          {icon && <span className="header-icon">{icon}</span>}
          <h4 className="main-title">{title}</h4>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
