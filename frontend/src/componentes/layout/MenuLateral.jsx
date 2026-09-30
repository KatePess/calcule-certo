import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ITENS_MENU } from '../../constantes/menu.js';
import { TEXTOS_PERFIL } from '../../constantes/mensagens.js';
import { ROTAS } from '../../constantes/rotas.js';
import { usePainelStore, useSessaoStore } from '../../stores/index.jsx';
import { iniciais, nomeCurto } from '../../utils/formatadores.js';
import { Icone, IconeAjuda, IconeChevron, IconeSair } from '../Icones.jsx';
import MenuPerfil from '../MenuPerfil.jsx';
import Modal from '../Modal.jsx';
import PassosAjuda from '../PassosAjuda.jsx';

// Tempo para levar o mouse do nome ate o menu do perfil sem que ele feche.
const ESPERA_PARA_FECHAR_MS = 250;

// Unica barra de navegacao do sistema: marca no topo, itens no meio e, no
// rodape, "Ajuda" e "Sair" acima da linha que separa os dados de quem esta
// logado. Passar o mouse nesse bloco com o nome (ou clicar nele) abre o menu
// do perfil. O NavLink marca o item da tela atual com aria-current="page",
// que o CSS usa para o destaque.
export default observer(function MenuLateral() {
  const sessao = useSessaoStore();
  const painel = usePainelStore();
  const { pathname, search } = useLocation();
  const [ajudaAberta, setAjudaAberta] = useState(false);
  const { usuario } = sessao;
  const totalAlertas = painel.alertas.length;

  // Menu do perfil: abre ao passar o mouse e fecha pouco depois de o mouse
  // sair. Aberto por clique ou toque, fica "fixo" ate novo clique, Esc ou
  // clique fora; assim funciona tambem no celular e pelo teclado.
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [perfilFixo, setPerfilFixo] = useState(false);
  const espera = useRef(null);
  const botaoPerfil = useRef(null);

  const abrirPerfil = useCallback(() => {
    clearTimeout(espera.current);
    setPerfilAberto(true);
  }, []);

  const fecharPerfil = useCallback(() => {
    clearTimeout(espera.current);
    setPerfilAberto(false);
    setPerfilFixo(false);
  }, []);

  const fecharPerfilDepois = useCallback(() => {
    if (perfilFixo) return;
    clearTimeout(espera.current);
    espera.current = setTimeout(() => setPerfilAberto(false), ESPERA_PARA_FECHAR_MS);
  }, [perfilFixo]);

  function alternarPerfil() {
    if (perfilAberto && perfilFixo) {
      fecharPerfil();
      return;
    }
    abrirPerfil();
    setPerfilFixo(true);
  }

  // Escolher um item leva a outra tela (ou a outro item do perfil): fecha o menu.
  useEffect(() => {
    fecharPerfil();
  }, [pathname, search, fecharPerfil]);

  useEffect(() => () => clearTimeout(espera.current), []);

  // Os alertas de prazo alimentam o contador ao lado de "Home".
  useEffect(() => {
    painel.carregarSeNecessario();
  }, [painel]);

  return (
    <>
      <aside className="menu">
        <p className="menu__marca">
          Calcule <span>Certo</span>
        </p>

        <nav className="menu__navegacao" aria-label="Menu principal">
          <ul className="menu__itens">
            {ITENS_MENU.map((item) => (
              <li key={item.rota}>
                <NavLink to={item.rota} className="menu__item">
                  <Icone nome={item.icone} tamanho={20} />
                  <span>{item.rotulo}</span>
                  {item.mostraAlertas && totalAlertas > 0 && (
                    <span className="menu__contador" title={`${totalAlertas} licitação(ões) abrindo nos próximos 7 dias`}>
                      {totalAlertas}
                      <span className="visualmente-oculto">
                        {totalAlertas === 1 ? ' alerta de prazo' : ' alertas de prazo'}
                      </span>
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="menu__item" onClick={() => setAjudaAberta(true)}>
          <IconeAjuda tamanho={20} />
          <span>Ajuda</span>
        </button>

        <button type="button" className="menu__item" onClick={() => sessao.sair()}>
          <IconeSair tamanho={20} />
          <span>Sair</span>
        </button>

        <div className="menu__rodape">
          <button
            ref={botaoPerfil}
            type="button"
            className={`menu__usuario${pathname === ROTAS.PERFIL ? ' menu__usuario--ativo' : ''}`}
            aria-haspopup="true"
            aria-expanded={perfilAberto}
            aria-controls="menu-perfil"
            onMouseEnter={abrirPerfil}
            onMouseLeave={fecharPerfilDepois}
            onClick={alternarPerfil}
          >
            <span className="menu__avatar" aria-hidden="true">
              {iniciais(usuario?.nome)}
            </span>
            <span className="menu__usuario-dados">
              <span className="visualmente-oculto">{TEXTOS_PERFIL.MENU}: </span>
              <span className="menu__usuario-nome">{nomeCurto(usuario?.nome)}</span>
              <span className="menu__usuario-email">{usuario?.email}</span>
            </span>
            <IconeChevron tamanho={16} />
          </button>
        </div>
      </aside>

      {/* Fora do <aside>: no celular a gaveta e deslocada com transform, e o
          modal (e o menu do perfil) dentro dela ficaria preso a gaveta. */}
      {perfilAberto && (
        <MenuPerfil
          id="menu-perfil"
          ancora={botaoPerfil}
          aoEntrar={abrirPerfil}
          aoSair={fecharPerfilDepois}
          aoFechar={fecharPerfil}
        />
      )}

      {ajudaAberta && (
        <Modal titulo="Como usar o Calcule Certo" aoFechar={() => setAjudaAberta(false)}>
          <PassosAjuda />
        </Modal>
      )}
    </>
  );
});
