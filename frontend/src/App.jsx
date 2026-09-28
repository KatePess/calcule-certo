import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LayoutInterno from './componentes/layout/LayoutInterno.jsx';
import RotaProtegida from './componentes/RotaProtegida.jsx';
import SomenteVisitante from './componentes/SomenteVisitante.jsx';
import { ROTAS } from './constantes/rotas.js';
import Cadastro from './paginas/Cadastro.jsx';
import Login from './paginas/Login.jsx';
import NovoCalculo from './paginas/NovoCalculo.jsx';
import Painel from './paginas/Painel.jsx';
import Perfil from './paginas/Perfil.jsx';
import Relatorios from './paginas/Relatorios.jsx';
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
        <Route path={ROTAS.HOME} element={<Painel />} />
        <Route path={ROTAS.ORCAMENTO} element={<NovoCalculo />} />
        <Route path={`${ROTAS.ORCAMENTO}/:calculoId`} element={<NovoCalculo />} />
        <Route path={ROTAS.RELATORIOS} element={<Relatorios />} />
        <Route path={ROTAS.PERFIL} element={<Perfil />} />
        <Route path={ROTAS.RESUMO} element={<ResumoSistema />} />
      </Route>

      <Route path="*" element={<Navigate to={ROTAS.LOGIN} replace />} />
    </Routes>
  );
}
