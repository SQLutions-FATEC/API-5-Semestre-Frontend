import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound/Notfound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Adicionar as rotas das paginas abaixo */}
        <Route path="*" element={<NotFound />} />
        {/*
         Para rotas dinamicas utilizar como o exemplo abaixo passando o id com useParams na pagina escolhida
         <Route path="/produto/:id" element={<DetalhesProduto />} />
         */}
      </Route>
    </Routes>
  );
}

export default App;
