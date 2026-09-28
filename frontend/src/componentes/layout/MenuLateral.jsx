import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { ITENS_MENU } from '../../constantes/menu.js';
import { useSessaoStore } from '../../stores/index.jsx';
import { Icone, IconeSair } from '../Icones.jsx';

export default observer(function MenuLateral() {
  const sessao = useSessaoStore();

  return (
    <nav className="menu" aria-label="Menu principal">
      <p className="menu__marca">Calcule Certo</p>

      <ul className="menu__itens">
        {ITENS_MENU.map((item) => (
          <li key={item.rota}>
            <NavLink to={item.rota} className={({ isActive }) => `menu__item ${isActive ? 'menu__item--ativo' : ''}`}>
              <Icone nome={item.icone} tamanho={20} />
              <span>{item.rotulo}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button type="button" className="menu__item menu__sair" onClick={() => sessao.sair()}>
        <IconeSair tamanho={20} />
        <span>Sair</span>
      </button>
    </nav>
  );
});
