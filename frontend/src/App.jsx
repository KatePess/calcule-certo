import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import SomenteVisitante from './componentes/SomenteVisitante.jsx';
import { ROTAS } from './constantes/rotas.js';
import Cadastro from './paginas/Cadastro.jsx';
import Home from './paginas/Home.jsx';
import Login from './paginas/Login.jsx';
import { useSessaoStore } from './stores/index.jsx';

export default function App() {
  const sessao = useSessaoStore();

  // Tenta recuperar a sessao uma unica vez, quando o app monta.
  useEffect(() => {
    sessao.restaurarSessao();
  }, [sessao]);

  return (
    <Routes>
      <Route path={ROTAS.RAIZ} element={<Navigate to={ROTAS.LOGIN} replace />} />
      <Route
        path={ROTAS.LOGIN}
        element={
          <SomenteVisitante>
            <Login />
          </SomenteVisitante>
        }
      />
      <Route
        path={ROTAS.CADASTRO}
        element={
          <SomenteVisitante>
            <Cadastro />
          </SomenteVisitante>
        }
      />
      <Route
        path={ROTAS.HOME}
        element={
          <RotaProtegida>
            <Home />
          </RotaProtegida>
        }
      />
      <Route path="*" element={<Navigate to={ROTAS.LOGIN} replace />} />
    </Routes>
  );
}
