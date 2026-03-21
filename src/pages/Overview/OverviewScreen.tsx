import { LayoutDashboard } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './OverviewScreen.scss';

export default function Overview() {
  return (
    <div className="overview-page">
      <PageHeader
        icon={<LayoutDashboard size={28} />}
        title="Visão Geral"
        subtitle="Acompanhamento consolidado de programas e projetos institucionais."
      />

      <div className="overview-content">
        <p>Conteúdo da página Visão Geral.</p>
      </div>
    </div>
  );
}
