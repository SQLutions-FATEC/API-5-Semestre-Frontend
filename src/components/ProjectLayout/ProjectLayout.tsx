import { useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import ProjectOverviewHeader from '../../pages/Overview/components/ProjectOverviewHeader/ProjectOverviewHeader';
import { projectService } from '../../services/projectService';
import type { ProjectOverviewResponse } from '../../types/project';

interface ProjectLayoutProps {
  readonly children: (data: ProjectOverviewResponse | null) => ReactNode;
  readonly pageClassName?: string;
  readonly contentClassName?: string;
}

export default function ProjectLayout({
  children,
  pageClassName = 'overview-page',
  contentClassName = 'overview-content',
}: ProjectLayoutProps) {
  const { codigo_projeto } = useParams<{ codigo_projeto: string }>();
  const [data, setData] = useState<ProjectOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);

        if (!codigo_projeto) {
          throw new Error('Código do projeto não encontrado na URL');
        }

        const response = await projectService.getOverview(codigo_projeto);
        setData(response);
      } catch (err) {
        console.error('Error fetching project overview:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [codigo_projeto]);

  return (
    <div className={pageClassName}>
      <div className={contentClassName}>
        {loading ? (
          <div className="flex justify-center items-center h-32 mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">
              Carregando informações do projeto...
            </h2>
          </div>
        ) : (
          <ProjectOverviewHeader
            programName={data?.programa?.nome || 'Não disponível'}
            programCode={data?.programa?.codigo || '---'}
            programManager={data?.programa?.gerente || 'Não disponível'}
            finishDate={
              data?.projeto?.data_fim_prevista
                ? new Date(data.projeto.data_fim_prevista).toLocaleDateString('pt-BR')
                : new Date().toLocaleDateString('pt-BR')
            }
            projectName={data?.projeto?.nome || 'Não disponível'}
            projectCode={data?.projeto?.codigo || '---'}
            startDate={data?.projeto?.data_inicio || new Date().toISOString().split('T')[0]}
            responsible={data?.projeto?.responsavel || 'Não disponível'}
            status={data?.projeto?.status || 'Erro'}
            hasError={!data}
          />
        )}
        {children(data)}
      </div>
    </div>
  );
}
