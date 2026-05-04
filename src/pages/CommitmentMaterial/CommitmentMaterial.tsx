import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { commitmentService } from '../../services/commitmentService';
import './CommitmentMaterial.scss';
import CommitmentCharts from './components/CommitmentCharts/CommitmentCharts';
import CommitmentTab from './components/CommitmentTab/CommitmentTab';

import type {
  EmpenhoCategoria,
  EmpenhoMaterial,
  EmpenhoTempo,
  MaterialComStatus,
} from '../../types/commitment';

export default function CommitmentMaterial() {
  const [analyticsCategoria, setAnalyticsCategoria] = useState<EmpenhoCategoria[]>([]);
  const [analyticsMaterial, setAnalyticsMaterial] = useState<EmpenhoMaterial[]>([]);
  const [analyticsTempo, setAnalyticsTempo] = useState<EmpenhoTempo[]>([]);
  const [totalEmpenho, setTotalEmpenho] = useState(0);
  const [materiaisTabela, setMateriaisTabela] = useState<MaterialComStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const { codigo_projeto } = useParams<{ codigo_projeto: string }>();

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        if (!codigo_projeto) return;
        // Busca os dois endpoints em paralelo
        const [alertasData, empenhosData] = await Promise.all([
          commitmentService.getAlerts(codigo_projeto),
          commitmentService.getAnalytics(codigo_projeto),
        ]);

        const listaObsoletos = alertasData.alertas_criticos.materiais_obsoletos;

        // Lógica de Cruzamento: verifica se o material empenhado está na lista de alertas
        const codigosObsoletos = new Set(listaObsoletos.map((obs) => obs.codigo_material));

        const materiaisComStatus: MaterialComStatus[] = empenhosData.empenho_por_material.map(
          (mat) => ({
            ...mat,
            fornecedor: mat.fornecedor || 'SIATT Corp',
            isObsoleto: codigosObsoletos.has(mat.codigo_material),
          })
        );

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
  }, [codigo_projeto]);

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
