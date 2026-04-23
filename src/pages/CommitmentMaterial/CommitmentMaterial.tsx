import { useEffect, useState } from 'react';
import { commitmentService } from '../../services/commitmentService';
import './CommitmentMaterial.scss';
import CommitmentCharts from './components/CommitmentCharts/CommitmentCharts';
import CommitmentTab from './components/CommitmentTab/CommitmentTab';

export default function CommitmentMaterial() {
  const [analyticsCategoria, setAnalyticsCategoria] = useState<any[]>([]);
  const [analyticsMaterial, setAnalyticsMaterial] = useState<any[]>([]);
  const [analyticsTempo, setAnalyticsTempo] = useState<any[]>([]);
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

        // Lógica de Cruzamento: verifica se o material empenhado está na lista de alertas
        const codigosObsoletos = new Set(listaObsoletos.map((obs: any) => obs.codigo_material));

        const materiaisComStatus = empenhosData.empenho_por_material.map((mat: any) => ({
          ...mat,
          fornecedor: mat.fornecedor || 'SIATT Corp',
          isObsoleto: codigosObsoletos.has(mat.codigo_material),
        }));

        setAnalyticsCategoria(empenhosData.empenho_por_categoria);
        setAnalyticsMaterial(empenhosData.empenho_por_material);
        setAnalyticsTempo(empenhosData.empenho_por_tempo);
        setTotalEmpenho(empenhosData.empenho_total);
        setMateriaisTabela(materiaisComStatus);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  return (
    <div className="commitment-content">
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <p>Carregando painel analítico...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <CommitmentCharts
              empenhoCategoria={analyticsCategoria}
              empenhoTempo={analyticsTempo}
              empenhoMaterial={analyticsMaterial}
              total={totalEmpenho}
            />
            <CommitmentTab data={materiaisTabela} />
          </div>
        )}
      </div>
    </div>
  );
}
