import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NotFound from '../pages/NotFoundScreen/NotFoundScreen';
import OverviewScreen from '../pages/Overview/OverviewScreen';
import ProjectsScreen from '../pages/ProjectsScreen/ProjectsScreen';
import ListScreen from '../pages/ListScreen/ListScreen';
import DataScreen from '../pages/DataScreen/DataScreen';
import HelpScreen from '../pages/HelpScreen/HelpScreen';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OverviewScreen />} />
        <Route path="overview" element={<OverviewScreen />} />
        <Route path="projects" element={<ProjectsScreen />} />
        <Route path="lists" element={<ListScreen />} />
        <Route path="data" element={<DataScreen />} />
        <Route path="help" element={<HelpScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;