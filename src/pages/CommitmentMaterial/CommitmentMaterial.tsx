import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { commitmentService, type EmpenhoCategoria, type EmpenhoTempo, type MaterialObsoleto } from "../../services/commitmentService";
import ProjectOverviewHeader from "../Overview/components/ProjectOverviewHeader/ProjectOverviewHeader";
import './CommitmentMaterial.scss';
import CommitmentCharts from "./components/CommitmentCharts/CommitmentCharts";
import ObsoleteList from "./components/ObsoleteList/ObsoleteList";

export default function CommitmentMaterial() {
  const { id } = useParams<{ id: string }>();
  console.log("Código do Projeto na URL:", id);

  // Estados para guardar os dados da API
  const [obsoletos, setObsoletos] = useState<MaterialObsoleto[]>([]);
  const [analyticsCategoria, setAnalyticsCategoria] = useState<EmpenhoCategoria[]>([]);
  const [analyticsTempo, setAnalyticsTempo] = useState<EmpenhoTempo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        setLoading(true);
        const [alertasData, empenhosData] = await Promise.all([
          commitmentService.getAlerts(id),
          commitmentService.getAnalytics(id)
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
  }, [id]);

  return (
    <div className="commitment-page">
      <ProjectOverviewHeader />

      <div className="commitment-content">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>A carregar painel analítico...</p>
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
      </div>
    </div>
  );
}