import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { MENSAGENS } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { useSessaoStore } from '../stores/index.jsx';

// Quem ja esta autenticado nao precisa ver login/cadastro de novo.
export default observer(function SomenteVisitante({ children }) {
  const sessao = useSessaoStore();

  if (sessao.carregando) return <div className="tela-carregando">{MENSAGENS.CARREGANDO}</div>;
  if (sessao.estaAutenticado) return <Navigate to={ROTAS.HOME} replace />;
  return children;
});
