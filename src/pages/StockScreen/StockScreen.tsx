import { useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import StepSwitcher from '../../components/ui/StepSwitcher/StepSwitcher';
import { ChevronDown, Package, AlertTriangle, ShoppingCart } from 'lucide-react';
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

export default function StockScreen({
  alertas = [],
  estoque = [],
  pedidosAbertos = [],
  historico = [],
  totalPedidosEnvolvidos = 0,
  valorTotalEstoque = 'R$ 0,00',
}: Readonly<StockScreenProps>) {
  const [activeTab, setActiveTab] = useState('Materiais');
  const [chartType, setChartType] = useState('Quantidade');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        <div className="stock-container">
          <section className="stock-section">
            <div className="stock-header-grid">
              <div className="alerts-column">
                <div className="section-header">
                  <AlertTriangle size={18} className="section-icon" />
                  <h2 className="section-title">Materiais restantes de pedidos anteriores</h2>
                </div>
                <div className="alerts-list">
                  {isEmptyAlerts ? (
                    <div className="empty-state-small">
                      <p>Nenhum material restante de pedidos anteriores.</p>
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
                            <span className="material-qtd">{item.qtd}</span>
                            <span className="material-local">{item.local}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={`tab-panel ${activeTab === 'Pedidos abertos' ? 'active' : ''}`}>
                    <div className="open-orders-list">
                      {pedidosAbertos.length === 0 ? (
                        <div className="empty-state-small">
                          <p>Nenhum pedido aberto no momento.</p>
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
                    historico.map((item, i) => (
                      <div key={item.id} className="history-row" style={{ animationDelay: `${i * 0.05}s` }}>
                        <span className="history-cod">{item.cod}</span>
                        <span className="history-nome">{item.nome}</span>
                        <span className="history-cat">{item.cat}</span>
                        <span className="history-qtd">{item.qtd}</span>
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