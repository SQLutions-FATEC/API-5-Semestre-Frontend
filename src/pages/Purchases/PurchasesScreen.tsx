import ProjectOverviewHeader from '../Overview/components/ProjectOverviewHeader/ProjectOverviewHeader';
import PurchasesTabs from './components/PurchasesTabs/PurchasesTabs';
import './PurchasesScreen.scss';

export default function PurchasesScreen() {
  return (
    <div className="purchases-page">
      <div className="purchases-content">
        <ProjectOverviewHeader />
        <PurchasesTabs />
      </div>
    </div>
  );
}
