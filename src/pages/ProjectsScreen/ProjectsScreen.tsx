import { FolderKanban } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import './ProjectsScreen.scss';

export default function ProjectsScreen() {
  return (
    <div className="projects-page">
      <PageHeader
        icon={<FolderKanban size={28} />}
        title="Projetos"
        subtitle="Gerenciamento e acompanhamento de projetos."
      />

      <div className="projects-content">
        <p>Conteúdo da página Projetos.</p>
      </div>
    </div>
  );
}
