import { useState } from 'react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
import './ProjectDetailsTabs.scss';

export default function ProjectDetailsTabs() {
  const [activeTab, setActiveTab] = useState('Materiais');
  const tabs = ['Materiais', 'Tarefas'];

  return (
    <div className="project-details-tabs-container">
      <StepSwitcher
        options={tabs}
        activeOption={activeTab}
        onOptionChange={setActiveTab}
      >
        {activeTab === 'Materiais' && (
          <div className="tab-content">
            <h2 className="content-title">Empenho geral</h2>
            <div className="dashboard-placeholder">
              <div className="chart-section">
                <div className="dummy-chart line-chart">
                  <span>Line Chart Placeholder</span>
                </div>
                <div className="dummy-chart pie-chart">
                  <span>Chart Placeholder</span>
                </div>
              </div>
              <div className="table-section">
                <table>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome do material</th>
                      <th>Categoria</th>
                      <th>Qtde</th>
                      <th>Total</th>
                      <th>Data</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>MAT001</td>
                      <td>Capacitor Cerâmico 10uF</td>
                      <td>Capacitor</td>
                      <td>171</td>
                      <td>R$ 16.532,28</td>
                      <td>27/03/2026</td>
                      <td>Ativo</td>
                    </tr>
                    <tr>
                      <td>MAT002</td>
                      <td>Diodo Retificador 1N4007</td>
                      <td>Diodo</td>
                      <td>42</td>
                      <td>R$ 2.687,16</td>
                      <td>27/03/2027</td>
                      <td>Ativo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Tarefas' && (
          <div className="tab-content">
            <h2 className="content-title">Cronograma de Tarefas</h2>
            <div className="dashboard-placeholder">
              <div className="tasks-list">
                <div className="task-item">
                  <span className="task-name">Desenvolvimento de Protótipo</span>
                  <span className="task-status in-progress">Em andamento</span>
                </div>
                <div className="task-item">
                  <span className="task-name">Revisão Técnica</span>
                  <span className="task-status pending">Pendente</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </StepSwitcher>
    </div>
  );
}
