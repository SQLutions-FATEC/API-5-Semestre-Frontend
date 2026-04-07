import { useEffect, useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import type { EmpenhoCategoria, EmpenhoTempo } from '../../services/commitmentService';
import { commitmentService } from '../../services/commitmentService';
import './CommitmentMaterial.scss';
import CommitmentCharts from './components/CommitmentCharts/CommitmentCharts';
import CommitmentTab from './components/CommitmentTab/CommitmentTab';

export default function CommitmentMaterial() {
  const [analyticsCategoria, setAnalyticsCategoria] = useState<EmpenhoCategoria[]>([]);
  const [analyticsMaterial, setAnalyticsMaterial] = useState<any[]>([]);
  const [analyticsTempo, setAnalyticsTempo] = useState<EmpenhoTempo[]>([]);
  const [totalEmpenho, setTotalEmpenho] = useState(0);
  const [materiaisTabela, setMateriaisTabela] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mantendo o ID fixo por enquanto, conforme a estrutura atual da sua rota
  const idProjeto = 'PRJ003';

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        // Busca os dois endpoints em paralelo
        const [alertasData, empenhosData] = await Promise.all([
          commitmentService.getAlerts(idProjeto),
          commitmentService.getAnalytics(idProjeto),
        ]);

        const listaObsoletos = alertasData.alertas_criticos.materiais_obsoletos;

        setAnalyticsCategoria(empenhosData.empenho_por_categoria);
        setAnalyticsMaterial(empenhosData.empenho_por_material);
        setAnalyticsTempo(empenhosData.empenho_por_tempo);
        setTotalEmpenho(empenhosData.empenho_total);

        // Lógica de Cruzamento: verifica se o material empenhado está na lista de alertas
        const codigosObsoletos = listaObsoletos.map((obs: any) => obs.codigo_material);

        const materiaisComStatus = empenhosData.empenho_por_material.map((mat: any) => ({
          ...mat,
          isObsoleto: codigosObsoletos.includes(mat.codigo_material),
        }));

        setMateriaisTabela(materiaisComStatus);
      } catch (error) {
        console.error('Erro ao carregar os dados de integração:', error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <ProjectLayout pageClassName="commitment-page" contentClassName="commitment-content">
      {() => (
        <div className="mt-6">
          <div className="flex gap-2 mb-4">
            <button className="px-6 py-2 bg-blue-50 text-blue-800 border border-blue-200 font-semibold rounded-md shadow-sm">
              Materiais
            </button>
            <button className="px-6 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-md shadow-sm transition-colors">
              Tarefas
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
              <p>Carregando painel analítico...</p>
            </div>
          ) : (
            // A classe flex-col garante que os itens fiquem um embaixo do outro
            <div className="flex flex-col gap-8 w-full">
              <div className="w-full">
                <CommitmentCharts
                  empenhoCategoria={analyticsCategoria}
                  empenhoTempo={analyticsTempo}
                  empenhoMaterial={analyticsMaterial}
                  total={totalEmpenho}
                />
              </div>

              <div className="w-full">
                <CommitmentTab data={materiaisTabela} />
              </div>
            </div>
          )}
        </div>
      )}
    </ProjectLayout>
  );
}
