import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NotFound from '../pages/NotFoundScreen/NotFoundScreen';
import OverviewScreen from '../pages/Overview/OverviewScreen';
import HelpScreen from '../pages/HelpScreen/HelpScreen';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OverviewScreen />} />
        <Route path="help" element={<HelpScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;