import { useEffect, useState } from "react";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import type { EmpenhoCategoria, EmpenhoTempo, MaterialObsoleto } from "../../services/commitmentService";
import { commitmentService } from "../../services/commitmentService";
import './CommitmentMaterial.scss';
import CommitmentCharts from "./components/CommitmentCharts/CommitmentCharts";
import ObsoleteList from "./components/ObsoleteList/ObsoleteList";

export default function CommitmentMaterial() {
  const [obsoletos, setObsoletos] = useState<MaterialObsoleto[]>([]);
  const [analyticsCategoria, setAnalyticsCategoria] = useState<EmpenhoCategoria[]>([]);
  const [analyticsTempo, setAnalyticsTempo] = useState<EmpenhoTempo[]>([]);
  const [loading, setLoading] = useState(true);

  // Vamos carregar os dados de analytics assumindo PRJ003 se não houver lógica dinâmica de rota no projeto todo ainda
  const idProjeto = 'PRJ003';

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const [alertasData, empenhosData] = await Promise.all([
          commitmentService.getAlerts(idProjeto),
          commitmentService.getAnalytics(idProjeto)
        ]);

        setObsoletos(alertasData.alertas_criticos.materiais_obsoletos);
        setAnalyticsCategoria(empenhosData.empenho_por_categoria);
        setAnalyticsTempo(empenhosData.empenho_por_tempo);
      } catch (error) {
        console.error("Erro ao carregar os dados de integração:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []); // Removemos a dependência do ID da URL, já que o layout força para PRJ003

  return (
    <ProjectLayout pageClassName="commitment-page" contentClassName="commitment-content">
      {() => (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando painel analítico...</p>
            </div>
          ) : (
            <div className="analytics-section flex flex-col gap-6 mt-6">
              <CommitmentCharts
                empenhoCategoria={analyticsCategoria}
                empenhoTempo={analyticsTempo}
              />
              <ObsoleteList data={obsoletos} />
            </div>
          )}
        </>
      )}
    </ProjectLayout>
  );
}