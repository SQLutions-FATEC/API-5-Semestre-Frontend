import { useState } from 'react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
import TrackingDashboard from '../TrackingDashboard/TrackingDashboard';
import ExpensesDashboard from '../ExpensesDashboard/ExpensesDashboard';
import './RequestsTab.scss';

export default function RequestsTab() {
  const [activeSubTab, setActiveSubTab] = useState('Acompanhamento');
  const subTabs = ['Acompanhamento', 'Gastos'];

  return (
    <div className="requests-tab-container">
      <div className="nested-step-switcher">
        <StepSwitcher
          options={subTabs}
          activeOption={activeSubTab}
          onOptionChange={setActiveSubTab}
        >
          {activeSubTab === 'Acompanhamento' && (
            <div className="sub-tab-content">
              <TrackingDashboard />
            </div>
          )}
          {activeSubTab === 'Gastos' && (
            <div className="sub-tab-content">
              <ExpensesDashboard />
            </div>
          )}
        </StepSwitcher>
      </div>
    </div>
  );
}
