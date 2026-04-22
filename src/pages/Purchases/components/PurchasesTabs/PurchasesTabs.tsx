import { useState } from 'react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
import RequestDashboardScreen from '../../../Requests/RequestDashboardScreen';
import RequestsTab from '../RequestsTab/RequestsTab';
import './PurchasesTabs.scss';

export default function PurchasesTabs() {
  const [activeTab, setActiveTab] = useState('Solicitações');
  const tabs = ['Solicitações', 'Pedidos'];

  return (
    <div className="purchases-tabs-container">
      <StepSwitcher options={tabs} activeOption={activeTab} onOptionChange={setActiveTab}>
        {activeTab === 'Solicitações' && (
          <div className="tab-content">
            <RequestDashboardScreen />
          </div>
        )}
        {activeTab === 'Pedidos' && (
          <div className="tab-content">
            <RequestsTab />
          </div>
        )}
      </StepSwitcher>
    </div>
  );
}
