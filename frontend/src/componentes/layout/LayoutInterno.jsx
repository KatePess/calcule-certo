import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { IconeMenu } from '../Icones.jsx';
import MenuLateral from './MenuLateral.jsx';
import '../../estilos/layout.css';

// Moldura de todas as telas internas: menu lateral + conteudo.
// No celular, o menu vira uma gaveta; a faixa do topo so existe la, para
// guardar o botao que abre a gaveta.
export default function LayoutInterno() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { pathname, search } = useLocation();

  // Fecha a gaveta ao trocar de tela, e tambem ao trocar so o item do perfil
  // (/perfil?secao=...), que muda o endereco sem mudar a tela.
  useEffect(() => {
    setMenuAberto(false);
  }, [pathname, search]);

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
        <div className="topo-celular">
          <button
            type="button"
            className="topo-celular__menu"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto(true)}
          >
            <IconeMenu />
          </button>
          <p className="topo-celular__marca">
            Calcule <span>Certo</span>
          </p>
        </div>
        <main className="interno__conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
