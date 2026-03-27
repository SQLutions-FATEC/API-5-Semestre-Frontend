import OverviewMetrics from './components/OverviewMetrics/OverviewMetrics';
import ProjectOverviewHeader from './components/ProjectOverviewHeader/ProjectOverviewHeader';
import './OverviewScreen.scss';

export default function Overview() {
  return (
    <div className="overview-page">
      <div className="overview-content">
        <ProjectOverviewHeader />
        <OverviewMetrics />
      </div>
    </div>
  );
}
