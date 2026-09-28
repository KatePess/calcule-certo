import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import EtiquetaStatus from '../componentes/EtiquetaStatus.jsx';
import { IconeExclamacao, IconeMais, IconePasta, IconeSetaDireita } from '../componentes/Icones.jsx';
import { MENSAGENS, TEXTOS_PAINEL } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { usePainelStore, useSessaoStore } from '../stores/index.jsx';
import { formatarDataLocal } from '../utils/datas.js';
import { formatarData, primeiroNome } from '../utils/formatadores.js';
import { formatarMoeda } from '../utils/moeda.js';
import '../estilos/painel.css';

// Painel inicial, conforme o prototipo home-system. O bloco "Relatorios
// recentes" aparece uma vez so: o prototipo o repetia, e o estudo de caso
// apontou a duplicacao como algo a corrigir.
export default observer(function Painel() {
  const { usuario } = useSessaoStore();
  const painel = usePainelStore();

  useEffect(() => {
    painel.carregar();
  }, [painel]);

  const carregandoPrimeiraVez = painel.carregando && !painel.carregado;

  return (
    <section className="pagina painel">
      <div className="painel__topo">
        <div>
          <h1 className="pagina__titulo pagina__titulo--grande">Olá, {primeiroNome(usuario.nome)}!</h1>
          <p className="pagina__legenda pagina__legenda--destaque">{TEXTOS_PAINEL.LEGENDA}</p>
        </div>
        <Link to={ROTAS.ORCAMENTO} className="botao botao--escuro painel__novo">
          {TEXTOS_PAINEL.NOVO_CALCULO}
          <IconeMais tamanho={18} />
        </Link>
      </div>

      {painel.erro && (
        <p className="aviso-erro" role="alert">
          {painel.erro}
        </p>
      )}

      <div className="painel__grade">
        <section className="cartao painel__licitacoes" aria-labelledby="painel-licitacoes">
          <h2 className="cartao__titulo" id="painel-licitacoes">
            {TEXTOS_PAINEL.LICITACOES}
          </h2>
          {carregandoPrimeiraVez && <p className="painel__vazio">{MENSAGENS.CARREGANDO}</p>}
          {painel.carregado && painel.licitacoesRecentes.length === 0 && (
            <p className="painel__vazio">{TEXTOS_PAINEL.SEM_LICITACOES}</p>
          )}
          <ul className="painel__lista">
            {painel.licitacoesRecentes.map((licitacao) => (
              <li key={licitacao.id} className="painel__licitacao">
                <div>
                  <span className="painel__licitacao-titulo">
                    Licitação {licitacao.numero} · {licitacao.orgao}
                  </span>
                  {licitacao.objeto && <span className="painel__licitacao-objeto">{licitacao.objeto}</span>}
                  <EtiquetaStatus status={licitacao.status} compacta />
                </div>
                <span className="painel__licitacao-calculos">{TEXTOS_PAINEL.calculos(licitacao.quantidadeCalculos)}</span>
              </li>
            ))}
          </ul>
          <Link to={ROTAS.RESUMO} className="botao botao--primario painel__ver-todas">
            {TEXTOS_PAINEL.VER_TODAS}
            <IconeSetaDireita tamanho={18} />
          </Link>
        </section>

        <div className="painel__lateral">
          <section className="cartao" aria-labelledby="painel-relatorios">
            <h2 className="cartao__titulo" id="painel-relatorios">
              {TEXTOS_PAINEL.RELATORIOS}
            </h2>
            {painel.carregado && painel.relatoriosRecentes.length === 0 && (
              <p className="painel__vazio">{TEXTOS_PAINEL.SEM_RELATORIOS}</p>
            )}
            <ul className="painel__lista">
              {painel.relatoriosRecentes.map((relatorio) => (
                <li key={relatorio.id}>
                  <Link to={ROTAS.RELATORIOS} className="painel__item">
                    <span className="painel__item-icone painel__item-icone--azul">
                      <IconePasta tamanho={20} />
                    </span>
                    <span className="painel__item-texto">
                      Licitação {relatorio.licitacao.numero} · {formatarMoeda(relatorio.resultadoFinal)}
                      <small>{formatarDataLocal(relatorio.geradoEm)}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="cartao" id="alertas" aria-labelledby="painel-alertas">
            <h2 className="cartao__titulo" id="painel-alertas">
              {TEXTOS_PAINEL.ALERTAS}
            </h2>
            {painel.carregado && painel.alertas.length === 0 && <p className="painel__vazio">{TEXTOS_PAINEL.SEM_ALERTAS}</p>}
            <ul className="painel__lista">
              {painel.alertas.map((alerta) => (
                <li key={alerta.id}>
                  <Link to={ROTAS.RESUMO} className="painel__item">
                    <span className="painel__item-icone painel__item-icone--vermelho">
                      <IconeExclamacao tamanho={20} />
                    </span>
                    <span className="painel__item-texto">
                      Licitação {alerta.numero} · {alerta.orgao} {TEXTOS_PAINEL.quandoAbre(alerta.diasParaAbertura)}
                      <small>{formatarData(alerta.dataAbertura)}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
});
