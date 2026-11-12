import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconeChevron,
  IconeDownload,
  IconeFechar,
  IconeMenu,
  IconePasta,
  IconePercentual,
  IconeSetaDireita,
} from '../componentes/Icones.jsx';
import {
  LINKS_RODAPE,
  NUMEROS_SOBRE,
  PASSOS_COMO_FUNCIONA,
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
          <Link to={ROTAS.LOGIN} className="botao-site botao-site--contorno">
            {TEXTOS_INICIO.ACESSAR}
          </Link>
          <Link to={ROTAS.CADASTRO} className="botao-site botao-site--claro">
            {TEXTOS_INICIO.CADASTRAR}
          </Link>
        </div>
      </div>
    </header>
  );
}

const ICONES_PASSOS = [IconePasta, IconePercentual, IconeDownload];

// Tela inicial publica, antes do login (landing page do prototipo).
export default function Inicio() {
  const [comoFunciona, sobre, duvidas] = SECOES_INICIO;

  return (
    <div className="inicio">
      <Topo />

      <main>
        <div className="vitrine">
          <section className="vitrine__apresentacao" aria-labelledby="inicio-titulo">
            <h1 id="inicio-titulo">{TEXTOS_INICIO.TITULO}</h1>
            <p className="vitrine__legenda">{TEXTOS_INICIO.LEGENDA}</p>
            <div className="vitrine__acoes">
              <Link to={ROTAS.CADASTRO} className="botao-site botao-site--grande botao-site--claro">
                {TEXTOS_INICIO.COMECAR}
              </Link>
              <a href={`#${comoFunciona.id}`} className="botao-site botao-site--grande botao-site--contorno">
                {TEXTOS_INICIO.SAIBA_MAIS} <IconeSetaDireita tamanho={20} />
              </a>
            </div>
          </section>
        </div>

        <section id={comoFunciona.id} className="inicio-secao" aria-labelledby="titulo-como-funciona">
          <h2 id="titulo-como-funciona" className="inicio-secao__titulo">
            {comoFunciona.rotulo}
          </h2>
          <p className="inicio-secao__texto">{TEXTOS_INICIO.COMO_FUNCIONA_LEGENDA}</p>
          <ol className="passos">
            {PASSOS_COMO_FUNCIONA.map(({ titulo, texto }, indice) => {
              const Icone = ICONES_PASSOS[indice];
              return (
                <li key={titulo} className="passo">
                  <span className="passo__icone">
                    <Icone tamanho={26} />
                  </span>
                  <span className="passo__numero">Passo {indice + 1}</span>
                  <h3>{titulo}</h3>
                  <p>{texto}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section id={sobre.id} className="inicio-secao" aria-labelledby="titulo-sobre">
          <h2 id="titulo-sobre" className="inicio-secao__titulo">
            {sobre.rotulo}
          </h2>
          {TEXTOS_INICIO.SOBRE.map((paragrafo) => (
            <p key={paragrafo} className="inicio-secao__texto">
              {paragrafo}
            </p>
          ))}
          <ul className="numeros">
            {NUMEROS_SOBRE.map(({ valor, texto }) => (
              <li key={valor} className="numero">
                <strong>{valor}</strong>
                <span>{texto}</span>
              </li>
            ))}
          </ul>
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
      </main>

      <footer className="site-rodape">
        <p className="site-rodape__marca">
          Calcule <span>Certo</span>
        </p>
        <nav className="site-rodape__links" aria-label="Acesso">
          {LINKS_RODAPE.map(({ rotulo, rota }) => (
            <Link key={rota} to={rota}>
              {rotulo}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
