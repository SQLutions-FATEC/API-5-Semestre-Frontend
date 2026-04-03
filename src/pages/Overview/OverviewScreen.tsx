import OverviewMetrics from './components/OverviewMetrics/OverviewMetrics';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import './OverviewScreen.scss';
import HoursTracking from './components/HoursTracking/HoursTracking';

export default function Overview() {
  return (
    <ProjectLayout pageClassName="overview-page" contentClassName="overview-content">
      {(data) => (
        <>
          <OverviewMetrics financeiro={data?.financeiro} />
          <HoursTracking />
        </>
      )}
    </ProjectLayout>
  );
}
