import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NotFound from '../pages/NotFoundScreen/NotFoundScreen';
import OverviewScreen from '../pages/Overview/OverviewScreen';
import PurchasesScreen from '../pages/Purchases/PurchasesScreen';
import StockScreen from '../pages/StockScreen/StockScreen';
import HelpScreen from '../pages/HelpScreen/HelpScreen';
import ProjectListingScreen from '../pages/Projects/ProjectListingScreen';
import ProgramListingScreen from '../pages/Programs/ProgramListingScreen';
import SuppliersScreen from '../pages/SuppliersScreen/SuppliersScreen';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/programas" replace />} />
      <Route element={<Layout />}>
        <Route path="programas" element={<ProgramListingScreen />} />
        <Route path="programas/:programa_cod/projetos" element={<ProjectListingScreen />} />
        <Route path="programas/:programa_cod/projetos/:codigo_projeto" element={<OverviewScreen />} />
        <Route path="programas/:programa_cod/projetos/:codigo_projeto/compras" element={<PurchasesScreen />} />
        <Route path="programas/:programa_cod/projetos/:codigo_projeto/estoque" element={<StockScreen />} />
        <Route path="programas/:programa_cod/projetos/:codigo_projeto/fornecedores" element={<SuppliersScreen />} />
        <Route path="help" element={<HelpScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
