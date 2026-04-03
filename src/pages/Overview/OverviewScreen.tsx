import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OverviewMetrics from './components/OverviewMetrics/OverviewMetrics';
import ProjectOverviewHeader from './components/ProjectOverviewHeader/ProjectOverviewHeader';
import { projectService, type ProjectOverviewResponse } from '../../services/projectService';
import './OverviewScreen.scss';

export default function Overview() {
  const { id = 'PRJ003' } = useParams<{ id: string }>();
  const [data, setData] = useState<ProjectOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);

        const idToFetch = id === '1' ? 'PRJ003' : id;

        const response = await projectService.getOverview(idToFetch);
        setData(response);
      } catch (err: any) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [id]);

  return (
    <div className="overview-page">
      <div className="overview-content">
        {loading ? (
          <div className="flex justify-center items-center h-32 mb-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">Carregando informações do projeto...</h2>
          </div>
        ) : (
          <>
            <ProjectOverviewHeader
              programName={data?.programa?.nome || 'Não disponível'}
              programCode={data?.programa?.codigo || '---'}
              programManager={data?.programa?.gerente || 'Não disponível'}
              finishDate={data?.projeto?.data_fim_prevista
                ? new Date(data.projeto.data_fim_prevista).toLocaleDateString('pt-BR')
                : new Date().toLocaleDateString('pt-BR')}
              projectName={data?.projeto?.nome || 'Não disponível'}
              projectCode={data?.projeto?.codigo || '---'}
              startDate={data?.projeto?.data_inicio || new Date().toISOString().split('T')[0]}
              responsible={data?.projeto?.responsavel || 'Não disponível'}
              status={data?.projeto?.status || 'Erro'}
              hasError={!data}
            />
          </>
        )}
        <OverviewMetrics financeiro={data?.financeiro} />
      </div>
    </div>
  );
}
