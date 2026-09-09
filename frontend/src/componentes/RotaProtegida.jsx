import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import { MENSAGENS } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { useSessaoStore } from '../stores/index.jsx';

// Impede que a Home seja aberta digitando a URL sem estar logado.
export default observer(function RotaProtegida({ children }) {
  const sessao = useSessaoStore();

  if (sessao.carregando) return <div className="tela-carregando">{MENSAGENS.CARREGANDO}</div>;
  if (!sessao.estaAutenticado) return <Navigate to={ROTAS.LOGIN} replace />;
  return children;
});
