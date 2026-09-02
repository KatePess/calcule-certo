import { Navigate } from 'react-router-dom';
import { useSessao } from '../sessao.jsx';

// Impede que a Home seja aberta digitando a URL sem estar logado.
export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useSessao();

  if (carregando) return <div className="tela-carregando">Carregando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}
