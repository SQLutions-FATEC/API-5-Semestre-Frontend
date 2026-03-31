import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
import SectionHeader from '../../../../components/ui/SectionHeader/SectionHeader';
import PurchaseDetailsTable from '../PurchaseDetailsTable/PurchaseDetailsTable';
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
            <SectionHeader 
              title="Empenho Geral" 
              label="Visão de Custos" 
              icon={<BarChart3 size={20} />} 
              className="primary-accent" 
            />
            <div className="dashboard-placeholder">
              <div className="chart-section">
                <div className="dummy-chart line-chart">
                  <span>Line Chart Placeholder</span>
                </div>
                <div className="dummy-chart pie-chart">
                  <span>Chart Placeholder</span>
                </div>
              </div>
              <PurchaseDetailsTable />
            </div>
          </div>
        )}

        {activeTab === 'Tarefas' && (
          <div className="tab-content">
            <h2 className="content-title">
              <span className="placeholder-text">Cronograma de Tarefas (em breve)</span>
            </h2>
          </div>
        )}
      </StepSwitcher>
    </div>
  );
}
