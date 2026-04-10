import { useState } from 'react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
import CommitmentMaterial from '../../../CommitmentMaterial/CommitmentMaterial';
import HoursTracking from '../HoursTracking/HoursTracking';
import './OverviewTabs.scss';

export default function OverviewTabs() {
  const [activeTab, setActiveTab] = useState('Empenho de Materiais');
  const tabs = ['Empenho de Materiais', 'Rastreamento de Tarefas'];

  return (
    <div className="overview-tabs-container">
      <StepSwitcher options={tabs} activeOption={activeTab} onOptionChange={setActiveTab}>
        {activeTab === 'Empenho de Materiais' && (
          <div className="tab-content">
            <CommitmentMaterial />
          </div>
        )}
        {activeTab === 'Rastreamento de Tarefas' && (
          <div className="tab-content">
            <HoursTracking />
          </div>
        )}
      </StepSwitcher>
    </div>
  );
}
