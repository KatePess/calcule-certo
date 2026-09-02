import { Navigate } from 'react-router-dom';
import { useSessao } from '../sessao.jsx';

// Quem ja esta autenticado nao precisa ver login/cadastro de novo.
export default function SomenteVisitante({ children }) {
  const { usuario, carregando } = useSessao();

  if (carregando) return <div className="tela-carregando">Carregando...</div>;
  if (usuario) return <Navigate to="/home" replace />;
  return children;
}
