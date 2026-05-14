import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import StepSwitcher from '../../components/ui/StepSwitcher/StepSwitcher';
import { ChevronDown, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
import { projectService } from '../../services/projectService';
import type { StockSobrasResponse } from '../../types/stock';
import { commitmentService } from '../../services/commitmentService';
import './StockScreen.scss';

interface Alerta {
  id: string;
  texto: string;
}

interface MaterialEstoque {
  id: string;
  nome: string;
  qtd: number;
  local: string;
}

interface PedidoAberto {
  id: string;
  texto: string;
}

interface HistoricoEmpenho {
  id: string;
  cod: string;
  nome: string;
  cat: string;
  qtd: number;
  data: string;
  status: string;
}

interface StockScreenProps {
  alertas?: Alerta[];
  estoque?: MaterialEstoque[];
  pedidosAbertos?: PedidoAberto[];
  historico?: HistoricoEmpenho[];
  totalPedidosEnvolvidos?: number;
  valorTotalEstoque?: string;
}

export default function StockScreen(props: StockScreenProps) {
  const { codigo_projeto } = useParams<{ codigo_projeto: string }>();
  const [activeTab, setActiveTab] = useState('Materiais');
  const [chartType, setChartType] = useState('Quantidade');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [alertas, setAlertas] = useState<Alerta[]>(props.alertas || []);
  const [estoque, setEstoque] = useState<MaterialEstoque[]>(props.estoque || []);
  const [pedidosAbertos, setPedidosAbertos] = useState<PedidoAberto[]>(props.pedidosAbertos || []);
  const [historico, setHistorico] = useState<HistoricoEmpenho[]>(props.historico || []);
  const [totalPedidosEnvolvidos, setTotalPedidosEnvolvidos] = useState(props.totalPedidosEnvolvidos || 0);
  const [valorTotalEstoque, setValorTotalEstoque] = useState(props.valorTotalEstoque || 'R$ 0,00');
  const [numericValue, setNumericValue] = useState(0);

  const fetchData = async () => {
    try {
      if (!codigo_projeto) return;

      // Busca dados de sobras e conflitos
      const data: StockSobrasResponse = await projectService.getStockSobras(codigo_projeto);

      // Busca dados de histórico de empenhos (usando analytics)
      let analyticsData;
      try {
        analyticsData = await commitmentService.getAnalytics(codigo_projeto);
      } catch (err) {
        console.warn('Erro ao buscar analytics, usando dados vazios:', err);
        analyticsData = { empenho_por_material: [] };
      }

      // MOCK PARA PRJ020
      if (codigo_projeto === 'PRJ020') {
        data.alertas_estoque_ocioso = [
          {
            codigo_material: "MAT101",
            descricao: "Capacitor 100uF",
            quantidade_solicitada_atual: 100,
            sobras_detectadas: [
              {
                projeto_origem_codigo: "PRJ001",
                projeto_origem_nome: "PROJETO ENCERRADO ALPHA",
                quantidade_disponivel: 150,
                status_projeto_origem: "CONCLUIDO",
                localizacao_fisica: "Almoxarifado Central"
              }
            ],
            potencial_economia_estimada: 600.0
          }
        ];
        data.conflitos_compra_aberta = [
          {
            material: "LED SMD Branco 0805",
            pedido_compra_atual: "PC0062",
            quantidade_no_pedido: 426,
            alerta: "Existe estoque disponível em outros projetos que supre esta necessidade sem nova compra.",
            disponivel_outras_fontes: 2565
          }
        ];
        data.valor_total_material = 14000.0;
      }

      const valTotal = data.valor_total_material ?? 0;
      setNumericValue(valTotal);

      const formattedValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valTotal);
      setValorTotalEstoque(formattedValue);

      // Mapear Estoque Ocioso para Alertas (Topo)
      const mappedAlertas: Alerta[] = [];
      const ociosoList = data.alertas_estoque_ocioso || [];

      ociosoList.forEach((alerta) => {
        alerta.sobras_detectadas.forEach((sobra, idx) => {
          mappedAlertas.push({
            id: `ocioso-${alerta.codigo_material}-${idx}`,
            texto: `Há ${new Intl.NumberFormat('pt-BR').format(sobra.quantidade_disponivel)} ${alerta.descricao} do pedido ${sobra.projeto_origem_codigo} do projeto ${sobra.projeto_origem_nome} (${sobra.projeto_origem_codigo} | ${sobra.status_projeto_origem}) restantes após cobrir a demanda da solicitação`
          });
        });
      });

      // Mapear Conflitos para Pedidos Abertos (Tab)
      const mappedPedidos: PedidoAberto[] = (data.conflitos_compra_aberta || []).map((c, i) => {
        // Tenta encontrar o projeto de origem buscando no array de estoque ocioso pelo material
        const alertaRelacionado = ociosoList.find(a => a.descricao === c.material);
        const sourceProj = alertaRelacionado?.sobras_detectadas[0]?.projeto_origem_codigo || 'outro pedido';

        return {
          id: `pedido-${i}`,
          texto: `O pedido (${c.pedido_compra_atual}) esta pedindo o material ${c.material} que possui sobras de outro pedido (${sourceProj})`
        };
      });

      // Mapear Estoque (Lista de Materiais na Tab)
      const mappedEstoque: MaterialEstoque[] = ociosoList.map((o, i) => ({
        id: `ocioso-list-${i}`,
        nome: o.descricao,
        qtd: o.sobras_detectadas.reduce((acc, s) => acc + s.quantidade_disponivel, 0),
        local: o.sobras_detectadas[0]?.localizacao_fisica || 'Almoxarifado'
      }));

      // Mapear Histórico de Empenhos
      const mappedHistorico: HistoricoEmpenho[] = (analyticsData.empenho_por_material || []).map((m, i) => ({
        id: `empenho-${i}`,
        cod: m.codigo_material,
        nome: m.descricao,
        cat: m.categoria || 'Geral',
        qtd: m.quantidade_total || 0,
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Ativo'
      }));

      setAlertas(mappedAlertas);
      setEstoque(mappedEstoque);
      setPedidosAbertos(mappedPedidos);
      setHistorico(mappedHistorico);
      setTotalPedidosEnvolvidos(data.conflitos_compra_aberta?.length || 0);

    } catch (err) {
      console.error('Erro ao buscar dados de estoque:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [codigo_projeto]);

  const handleChartTypeChange = () => {
    setIsTransitioning(true);
    setChartType(chartType === 'Quantidade' ? 'Custo' : 'Quantidade');
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const isEmptyHistory = historico.length === 0;
  const isEmptyAlerts = alertas.length === 0;

  return (
    <ProjectLayout pageClassName="stock-page" contentClassName="stock-content">
      {() => (
        <div className="stock-container mt-16">
          <section className="stock-section">
            <div className="stock-header-grid">
              <div className="alerts-column">
                <div className="section-header">
                  <AlertTriangle size={18} className="section-icon" />
                  <h2 className="section-title">Materiais restantes de pedidos anteriores</h2>
                </div>
                <div className="alerts-list">
                  {isEmptyAlerts ? (
                    <div className="empty-state-card">
                      <div className="empty-state-small">
                        <p>Nenhum material restante de pedidos anteriores.</p>
                      </div>
                    </div>
                  ) : (
                    alertas.map((alerta, i) => (
                      <div key={alerta.id} className="alert-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="alert-dot" />
                        <p>{alerta.texto}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="counter-card">
                <Package size={24} className="counter-icon" />
                <p className="counter-label">Pedidos envolvendo estes materiais</p>
                <span className="counter-number">{totalPedidosEnvolvidos}</span>
              </div>
            </div>
          </section>

          <section className="stock-section">
            <div className="stock-middle-grid">
              <div className="table-card">
                <StepSwitcher
                  options={['Materiais', 'Pedidos abertos']}
                  activeOption={activeTab}
                  onOptionChange={setActiveTab}
                />

                <div className="tab-content-wrapper">
                  <div className={`tab-panel ${activeTab === 'Materiais' ? 'active' : ''}`}>
                    <div className="materials-list">
                      <div className="materials-header">
                        <span>Nome do material</span>
                        <span>Quantidade</span>
                        <span>Localização</span>
                      </div>
                      {estoque.length === 0 ? (
                        <div className="empty-state-small">
                          <p>Nenhum material em estoque.</p>
                        </div>
                      ) : (
                        estoque.map((item, i) => (
                          <div key={item.id} className="materials-row" style={{ animationDelay: `${i * 0.05}s` }}>
                            <span className="material-name">{item.nome}</span>
                            <span className="material-qtd">{new Intl.NumberFormat('pt-BR').format(item.qtd)}</span>
                            <span className="material-local">{item.local}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={`tab-panel ${activeTab === 'Pedidos abertos' ? 'active' : ''}`}>
                    <div className="open-orders-list">
                      {pedidosAbertos.length === 0 ? (
                        <div className="empty-state-card">
                          <div className="empty-state-small">
                            <p>Nenhum pedido aberto no momento.</p>
                          </div>
                        </div>
                      ) : (
                        pedidosAbertos.map((pedido, i) => (
                          <div key={pedido.id} className="order-warning-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="order-icon-wrapper">
                              <ShoppingCart size={16} />
                            </div>
                            <p>{pedido.texto}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <p className="chart-title">Valor total em estoque</p>
                <h3 className="chart-value">{valorTotalEstoque}</h3>

                <button
                  className="chart-type-selector"
                  onClick={handleChartTypeChange}
                  aria-label="Alternar visualização do gráfico"
                >
                  <span>{chartType}</span>
                  <ChevronDown size={14} className={`chevron-icon ${isTransitioning ? 'rotating' : ''}`} />
                </button>

                <div className="donut-container">
                  <svg className="donut-svg" viewBox="0 0 140 140">
                    <circle
                      className="donut-ring"
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="20"
                    />
                    {numericValue > 0 ? (
                      <>
                        <circle
                          className={`donut-segment ${isTransitioning ? 'transitioning' : ''}`}
                          cx="70"
                          cy="70"
                          r="60"
                          fill="none"
                          stroke={chartType === 'Quantidade' ? '#3b82f6' : '#f97316'}
                          strokeWidth="20"
                          strokeDasharray={`${chartType === 'Quantidade' ? 245 : 207} 376.99`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                        />
                        <circle
                          className={`donut-segment-secondary ${isTransitioning ? 'transitioning' : ''}`}
                          cx="70"
                          cy="70"
                          r="60"
                          fill="none"
                          stroke={chartType === 'Quantidade' ? '#f59e0b' : '#3b82f6'}
                          strokeWidth="20"
                          strokeDasharray={`${chartType === 'Quantidade' ? 131.99 : 169.99} 376.99`}
                          strokeDashoffset={`-${chartType === 'Quantidade' ? 245 : 207}`}
                          strokeLinecap="round"
                        />
                      </>
                    ) : (
                      <circle
                        className="donut-ring"
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="20"
                        opacity="0.3"
                      />
                    )}
                  </svg>
                  <div className="donut-center">
                    <span className="donut-label">Resumo</span>
                  </div>
                </div>
                <p className="chart-footer">Distribuição de Materiais</p>
              </div>
            </div>
          </section>

          <section className="stock-section">
            <div className="history-section">
              <h2 className="section-title">Histórico de empenhos</h2>
              <div className="history-table">
                <div className="history-header">
                  <span>Código</span>
                  <span>Nome do material</span>
                  <span>Categoria</span>
                  <span>Qtd empenhada</span>
                  <span>Data de empenho</span>
                  <span>Status</span>
                </div>

                <div className="history-body">
                  {isEmptyHistory ? (
                    <div className="empty-state">
                      <div className="empty-icon-wrapper">
                        <Package size={48} />
                      </div>
                      <p className="empty-title">Nenhum empenho encontrado</p>
                      <p className="empty-hint">Os empenhos aparecerão aqui quando forem registrados.</p>
                    </div>
                  ) : (
                    historico.map((item) => (
                      <div key={item.id} className="history-row" style={{ animationDelay: `${item.id}s` }}>
                        <span className="history-cod">{item.cod}</span>
                        <span className="history-nome">{item.nome}</span>
                        <span className="history-cat">{item.cat}</span>
                        <span className="history-qtd">{new Intl.NumberFormat('pt-BR').format(item.qtd)}</span>
                        <span className="history-data">{item.data}</span>
                        <span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </ProjectLayout>
  );
}