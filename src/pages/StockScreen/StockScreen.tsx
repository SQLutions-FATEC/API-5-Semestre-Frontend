import { useState } from 'react';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import StepSwitcher from '../../components/ui/StepSwitcher/StepSwitcher';
import './StockScreen.scss';

const MOCK_DATA = {
  alertas: [
    { texto: "Há 300 unidades de Diodo X do projeto Conversor DC-DC Isolado (MAT-D01 | Suspenso) restantes." },
    { texto: "Há 150 unidades de Capacitor Cerâmico 10uF do projeto Conversor DC-DC Isolado (MAT-C05 | Concluído) restantes." }
  ],
  estoque: [
    { nome: "Capacitor Cerâmico 10uF 0603", qtd: 86, local: "Laboratório A" },
    { nome: "Diodo Retificador 1N4007", qtd: 486, local: "Laboratório C" },
    { nome: "Capacitor Cerâmico 1nF 0402", qtd: 267, local: "Linha Protótipo" },
  ],
  historico: [
    { cod: "MAT001", nome: "Capacitor Cerâmico 10uF 0603", cat: "Capacitor", qtd: 171, data: "27/03/2026", status: "Ativo" },
    { cod: "MAT002", nome: "Diodo Retificador 1N4007", cat: "Diodo", qtd: 42, data: "27/03/2027", status: "Ativo" },
  ]
};

export default function StockScreen() {
  const [activeTab, setActiveTab] = useState('Materiais');

  return (
    <ProjectLayout pageClassName="stock-page" contentClassName="stock-content">
      {() => (
        <div className="stock-container">
          
          <div className="stock-header-grid">
            <div className="alerts-column">
              <h2 className="section-title">Materiais restantes de pedidos anteriores</h2>
              {MOCK_DATA.alertas.map((alerta, i) => (
                <div key={i} className="stock-alert-card">{alerta.texto}</div>
              ))}
            </div>
            <div className="counter-card">
              <p>Pedidos envolvendo estes materiais</p>
              <span className="number">2</span>
            </div>
          </div>

          <div className="stock-middle-grid">
            <div className="table-card">
              <StepSwitcher 
                options={['Materiais', 'Pedidos abertos']} 
                activeOption={activeTab} 
                onOptionChange={setActiveTab} 
              />
              <div className="tab-content">
                <div className="table-header">
                  <span>Nome do material</span>
                  <span>Quantidade</span>
                  <span>Localização</span>
                </div>
                {MOCK_DATA.estoque.map((item, i) => (
                  <div key={i} className="table-row">
                    <span>{item.nome}</span>
                    <span>{item.qtd}</span>
                    <span>{item.local}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card">
              <p className="chart-title">Valor total em estoque</p>
              <h3 className="chart-value">R$ 191.210,00</h3>
              <div className="donut-container">
                <div className="donut-chart">
                  <div className="donut-center">Resumo</div>
                </div>
              </div>
              <p className="chart-footer">Distribuição de Materiais</p>
            </div>
          </div>

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
              {MOCK_DATA.historico.map((item, i) => (
                <div key={i} className="history-row">
                  <span>{item.cod}</span>
                  <span>{item.nome}</span>
                  <span>{item.cat}</span>
                  <span>{item.qtd}</span>
                  <span>{item.data}</span>
                  <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </ProjectLayout>
  );
}