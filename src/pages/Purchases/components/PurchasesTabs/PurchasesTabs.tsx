import { useState } from 'react';
import StepSwitcher from '../../../../components/ui/StepSwitcher/StepSwitcher';
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
            <RequestsTab />
          </div>
        )}
        {activeTab === 'Pedidos' && (
          <div className="tab-content">
            <h2 className="content-title">
              <span className="placeholder-text">Gerenciamento de Pedidos (em breve)</span>
            </h2>
          </div>
        )}
      </StepSwitcher>
    </div>
  );
}
