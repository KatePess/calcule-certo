import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Cabecalho from './Cabecalho.jsx';
import MenuLateral from './MenuLateral.jsx';
import '../../estilos/layout.css';

// Moldura de todas as telas internas: menu lateral + cabecalho + conteudo.
// No celular, o menu vira uma gaveta aberta pelo botao do cabecalho.
export default function LayoutInterno() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname } = useLocation();

  // Fecha a gaveta ao trocar de tela.
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  return (
    <div className={`interno ${menuAberto ? 'interno--menu-aberto' : ''}`}>
      <MenuLateral />
      <button
        type="button"
        className="interno__sombra"
        aria-label="Fechar menu"
        tabIndex={menuAberto ? 0 : -1}
        onClick={() => setMenuAberto(false)}
      />
      <div className="interno__principal">
        <Cabecalho aoAbrirMenu={() => setMenuAberto(true)} />
        <main className="interno__conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
