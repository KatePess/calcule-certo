import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { TEXTOS_PERFIL } from '../constantes/mensagens.js';
import { SECAO_PADRAO, SECOES_PERFIL } from '../constantes/perfil.js';
import { ROTAS } from '../constantes/rotas.js';
import { usePainelStore, useSessaoStore } from '../stores/index.jsx';
import { iniciais } from '../utils/formatadores.js';
import { Icone, IconeEngrenagem } from './Icones.jsx';
import '../estilos/menu-perfil.css';

const LARGURA = 320;
const MARGEM_TELA = 8;
const DISTANCIA = 10;

const linkDaSecao = (id) => (id === SECAO_PADRAO ? ROTAS.PERFIL : `${ROTAS.PERFIL}?secao=${id}`);

// No computador, o menu abre a direita da barra lateral, com a base alinhada
// ao nome. Se nao couber (celular, com a gaveta aberta), abre em cima do nome.
function calcularPosicao(ancora) {
  const nome = ancora.getBoundingClientRect();
  const barra = ancora.closest('.menu')?.getBoundingClientRect() ?? nome;
  const largura = Math.min(LARGURA, window.innerWidth - 2 * MARGEM_TELA);

  if (window.innerWidth - barra.right - MARGEM_TELA >= largura + DISTANCIA) {
    return {
      left: barra.right + DISTANCIA,
      bottom: Math.max(MARGEM_TELA, window.innerHeight - nome.bottom),
      width: largura,
      maxHeight: nome.bottom - MARGEM_TELA,
    };
  }
  return {
    left: Math.max(MARGEM_TELA, Math.min(nome.left, window.innerWidth - largura - MARGEM_TELA)),
    bottom: window.innerHeight - nome.top + DISTANCIA,
    width: largura,
    maxHeight: nome.top - DISTANCIA - MARGEM_TELA,
  };
}

// Menu do perfil que abre sobre o nome de quem esta logado (rodape do menu
// lateral). `ancora` e o botao com o nome; o menu lateral controla quando abre.
export default observer(function MenuPerfil({ id, ancora, aoEntrar, aoSair, aoFechar }) {
  const { usuario } = useSessaoStore();
  const painel = usePainelStore();
  const { pathname } = useLocation();
  const [parametros] = useSearchParams();
  const caixa = useRef(null);
  const [posicao, setPosicao] = useState(null);
  const totalAlertas = painel.alertas.length;

  // Item destacado: o que esta aberto na tela "Meu perfil", se ela estiver aberta.
  const secaoAberta = pathname === ROTAS.PERFIL ? (parametros.get('secao') ?? SECAO_PADRAO) : null;

  useLayoutEffect(() => {
    const posicionar = () => setPosicao(calcularPosicao(ancora.current));
    posicionar();
    window.addEventListener('resize', posicionar);
    return () => window.removeEventListener('resize', posicionar);
  }, [ancora]);

  // Fecha com Esc (devolvendo o foco ao nome) ou com clique fora do menu.
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key !== 'Escape') return;
      aoFechar();
      ancora.current?.focus();
    }
    function aoClicar(evento) {
      if (!caixa.current?.contains(evento.target) && !ancora.current?.contains(evento.target)) aoFechar();
    }
    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('mousedown', aoClicar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('mousedown', aoClicar);
    };
  }, [ancora, aoFechar]);

  // Quem navega pelo teclado: ao sair do menu com Tab, ele fecha.
  function aoPerderFoco(evento) {
    const destino = evento.relatedTarget;
    if (destino && !caixa.current?.contains(destino) && destino !== ancora.current) aoFechar();
  }

  return (
    <div
      id={id}
      ref={caixa}
      className="menu-perfil"
      style={posicao ?? { visibility: 'hidden' }}
      onMouseEnter={aoEntrar}
      onMouseLeave={aoSair}
      onBlur={aoPerderFoco}
    >
      <div className="menu-perfil__topo">
        <span className="menu-perfil__avatar" aria-hidden="true">
          {iniciais(usuario?.nome)}
        </span>
        <div className="menu-perfil__identificacao">
          <strong title={usuario?.nome}>{usuario?.nome}</strong>
          <span title={usuario?.email}>{usuario?.email}</span>
        </div>
        <Link
          to={ROTAS.PERFIL}
          className="menu-perfil__configurar"
          aria-label={TEXTOS_PERFIL.ABRIR_PERFIL}
          title={TEXTOS_PERFIL.ABRIR_PERFIL}
        >
          <IconeEngrenagem tamanho={24} />
        </Link>
      </div>

      <nav aria-label={TEXTOS_PERFIL.MENU}>
        <ul className="menu-perfil__itens">
          {SECOES_PERFIL.map((secao) => (
            <li key={secao.id}>
              <Link
                to={linkDaSecao(secao.id)}
                className="menu-perfil__item"
                aria-current={secao.id === secaoAberta ? 'page' : undefined}
              >
                <Icone nome={secao.icone} tamanho={22} />
                <span>{secao.rotulo}</span>
                {secao.id === 'notificacoes' && totalAlertas > 0 && (
                  <span className="menu-perfil__contador">
                    {totalAlertas}
                    <span className="visualmente-oculto">
                      {totalAlertas === 1 ? ' alerta de prazo' : ' alertas de prazo'}
                    </span>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="menu-perfil__rodape">
        {TEXTOS_PERFIL.RODAPE} <Link to={linkDaSecao('privacidade')}>Privacidade</Link>.
      </p>
    </div>
  );
});
