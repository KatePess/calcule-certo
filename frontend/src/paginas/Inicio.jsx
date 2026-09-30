import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import imagemPessoa from '../assets/inicio/pessoa.webp';
import { IconeChevron, IconeFechar, IconeMenu, IconeSetaDireita } from '../componentes/Icones.jsx';
import {
  ATALHOS_SUPORTE,
  DESTAQUES,
  ID_DESTAQUES,
  PERGUNTAS_FREQUENTES,
  SECOES_INICIO,
} from '../constantes/inicio.js';
import { TEXTOS_INICIO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import '../estilos/inicio.css';

// Topo do site. No celular, links e botoes ficam dentro de um menu que abre.
function Topo() {
  const [menuAberto, setMenuAberto] = useState(false);
  const fechar = () => setMenuAberto(false);

  useEffect(() => {
    if (!menuAberto) return undefined;
    const aoTeclar = (evento) => evento.key === 'Escape' && setMenuAberto(false);
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [menuAberto]);

  return (
    <header className="site-topo">
      <Link to={ROTAS.RAIZ} className="site-topo__marca">
        Calcule <span>Certo</span>
      </Link>

      <button
        type="button"
        className="site-topo__alternar"
        aria-expanded={menuAberto}
        aria-controls="site-topo-menu"
        aria-label={menuAberto ? TEXTOS_INICIO.FECHAR_MENU : TEXTOS_INICIO.ABRIR_MENU}
        onClick={() => setMenuAberto((aberto) => !aberto)}
      >
        {menuAberto ? <IconeFechar tamanho={24} /> : <IconeMenu />}
      </button>

      <div id="site-topo-menu" className={`site-topo__menu${menuAberto ? ' site-topo__menu--aberto' : ''}`}>
        <nav className="site-topo__links" aria-label="Partes da página">
          {SECOES_INICIO.map(({ id, rotulo }) => (
            <a key={id} href={`#${id}`} onClick={fechar}>
              {rotulo}
            </a>
          ))}
        </nav>
        <div className="site-topo__acoes">
          <Link to={ROTAS.LOGIN} className="botao-site">
            {TEXTOS_INICIO.ACESSAR}
          </Link>
          <Link to={ROTAS.CADASTRO} className="botao-site">
            {TEXTOS_INICIO.CADASTRAR}
          </Link>
        </div>
      </div>
    </header>
  );
}

// Carrossel de cartoes. As setas so aparecem quando ha cartoes fora da
// tela; com os quatro cabendo (computador), elas nao teriam o que fazer.
function Destaques() {
  const trilho = useRef(null);
  const [limites, setLimites] = useState({ noInicio: true, noFim: true });

  const atualizarLimites = useCallback(() => {
    const elemento = trilho.current;
    if (!elemento) return;
    const { scrollLeft, clientWidth, scrollWidth } = elemento;
    setLimites({ noInicio: scrollLeft <= 1, noFim: scrollLeft + clientWidth >= scrollWidth - 1 });
  }, []);

  useEffect(() => {
    atualizarLimites();
    const observador = new ResizeObserver(atualizarLimites);
    observador.observe(trilho.current);
    return () => observador.disconnect();
  }, [atualizarLimites]);

  // Anda um cartao por clique (largura do cartao + espaco entre eles).
  function rolar(direcao) {
    const elemento = trilho.current;
    const cartao = elemento.firstElementChild;
    const espaco = parseFloat(getComputedStyle(elemento).columnGap) || 0;
    elemento.scrollBy({ left: direcao * (cartao.getBoundingClientRect().width + espaco), behavior: 'smooth' });
  }

  const temMais = !(limites.noInicio && limites.noFim);

  return (
    <section id={ID_DESTAQUES} className="destaques" aria-labelledby="destaques-titulo">
      <h2 id="destaques-titulo" className="destaques__titulo">
        {TEXTOS_INICIO.DESTAQUES}
      </h2>

      <div className="destaques__carrossel">
        {temMais && (
          <button
            type="button"
            className="destaques__seta destaques__seta--anterior"
            aria-label={TEXTOS_INICIO.DESTAQUES_ANTERIORES}
            disabled={limites.noInicio}
            onClick={() => rolar(-1)}
          >
            <IconeChevron tamanho={20} />
          </button>
        )}

        <ul ref={trilho} className="destaques__trilho" onScroll={atualizarLimites}>
          {DESTAQUES.map(({ titulo, descricao, imagem }) => (
            <li key={titulo} className="destaque">
              {/* A imagem so ilustra: o titulo ja diz o que o cartao apresenta. */}
              <img src={imagem} alt="" width="283" height="190" loading="lazy" />
              <div className="destaque__texto">
                <h3>{titulo}</h3>
                <p>{descricao}</p>
              </div>
            </li>
          ))}
        </ul>

        {temMais && (
          <button
            type="button"
            className="destaques__seta destaques__seta--proxima"
            aria-label={TEXTOS_INICIO.DESTAQUES_PROXIMOS}
            disabled={limites.noFim}
            onClick={() => rolar(1)}
          >
            <IconeChevron tamanho={20} />
          </button>
        )}
      </div>
    </section>
  );
}

// Tela inicial publica, antes do login (landing page do prototipo).
export default function Inicio() {
  const [sobre, duvidas, suporte] = SECOES_INICIO;

  return (
    <div className="inicio">
      <Topo />

      <main>
        <div className="vitrine">
          <section className="vitrine__apresentacao" aria-labelledby="inicio-titulo">
            <div className="vitrine__texto">
              <h1 id="inicio-titulo">{TEXTOS_INICIO.TITULO}</h1>
              <p>{TEXTOS_INICIO.LEGENDA}</p>
              <div className="vitrine__acoes">
                <Link to={ROTAS.CADASTRO} className="botao-site botao-site--grande">
                  {TEXTOS_INICIO.COMECAR}
                </Link>
                <a href={`#${ID_DESTAQUES}`} className="botao-site botao-site--grande">
                  {TEXTOS_INICIO.SAIBA_MAIS} <IconeSetaDireita tamanho={20} />
                </a>
              </div>
            </div>
            <img className="vitrine__pessoa" src={imagemPessoa} alt="" width="205" height="290" />
          </section>

          <Destaques />
        </div>

        <section id={sobre.id} className="inicio-secao" aria-labelledby="titulo-sobre">
          <h2 id="titulo-sobre" className="inicio-secao__titulo">
            {sobre.rotulo}
          </h2>
          {TEXTOS_INICIO.SOBRE.map((paragrafo) => (
            <p key={paragrafo} className="inicio-secao__texto">
              {paragrafo}
            </p>
          ))}
        </section>

        <section id={duvidas.id} className="inicio-secao" aria-labelledby="titulo-duvidas">
          <h2 id="titulo-duvidas" className="inicio-secao__titulo">
            {duvidas.rotulo}
          </h2>
          <div className="duvidas">
            {PERGUNTAS_FREQUENTES.map(({ pergunta, resposta }) => (
              <details key={pergunta} className="duvida">
                <summary>
                  {pergunta}
                  <IconeChevron tamanho={18} />
                </summary>
                <p>{resposta}</p>
              </details>
            ))}
          </div>
        </section>

        <section id={suporte.id} className="inicio-secao" aria-labelledby="titulo-suporte">
          <h2 id="titulo-suporte" className="inicio-secao__titulo">
            {suporte.rotulo}
          </h2>
          <p className="inicio-secao__texto">{TEXTOS_INICIO.SUPORTE_LEGENDA}</p>
          <ul className="suporte">
            {ATALHOS_SUPORTE.map(({ titulo, texto, rota, ancora }) => {
              const conteudo = (
                <>
                  <strong>
                    {titulo} <IconeSetaDireita tamanho={16} />
                  </strong>
                  <span>{texto}</span>
                </>
              );
              return (
                <li key={titulo}>
                  {rota ? (
                    <Link to={rota} className="suporte__atalho">
                      {conteudo}
                    </Link>
                  ) : (
                    <a href={`#${ancora}`} className="suporte__atalho">
                      {conteudo}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <footer className="site-rodape">
        <p className="site-rodape__marca">
          Calcule <span>Certo</span>
        </p>
        <p>{TEXTOS_INICIO.RODAPE}</p>
      </footer>
    </div>
  );
}
