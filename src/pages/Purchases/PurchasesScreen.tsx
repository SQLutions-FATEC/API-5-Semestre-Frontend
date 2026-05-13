import PurchasesTabs from './components/PurchasesTabs/PurchasesTabs';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import './PurchasesScreen.scss';

export default function PurchasesScreen() {
  return (
    <ProjectLayout pageClassName="purchases-page" contentClassName="purchases-content">
      {() => <PurchasesTabs />}
    </ProjectLayout>
  );
}
