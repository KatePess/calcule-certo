import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmConstrucao from './componentes/EmConstrucao.jsx';
import LayoutInterno from './componentes/layout/LayoutInterno.jsx';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import SomenteVisitante from './componentes/SomenteVisitante.jsx';
import { ROTAS } from './constantes/rotas.js';
import Cadastro from './paginas/Cadastro.jsx';
import Home from './paginas/Home.jsx';
import Login from './paginas/Login.jsx';
import ResumoSistema from './paginas/ResumoSistema.jsx';
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

      {/* Telas internas: exigem login e compartilham menu lateral e cabecalho. */}
      <Route
        element={
          <RotaProtegida>
            <LayoutInterno />
          </RotaProtegida>
        }
      >
        <Route path={ROTAS.HOME} element={<Home />} />
        <Route path={ROTAS.ORCAMENTO} element={<EmConstrucao titulo="Novo cálculo de licitação" sprint={3} />} />
        <Route path={ROTAS.RELATORIOS} element={<EmConstrucao titulo="Relatórios" sprint={4} />} />
        <Route path={ROTAS.PERFIL} element={<EmConstrucao titulo="Perfil" sprint={5} />} />
        <Route path={ROTAS.RESUMO} element={<ResumoSistema />} />
      </Route>

      <Route path="*" element={<Navigate to={ROTAS.LOGIN} replace />} />
    </Routes>
  );
}
