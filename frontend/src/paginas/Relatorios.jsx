import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconeCasa,
  IconeCheck,
  IconeChevron,
  IconeDownload,
  IconeEditar,
  IconeLixeira,
  IconePdf,
  IconeRelogio,
} from '../componentes/Icones.jsx';
import Modal from '../componentes/Modal.jsx';
import Paginacao from '../componentes/Paginacao.jsx';
import { MENSAGENS, TEXTOS_RELATORIOS } from '../constantes/mensagens.js';
import { PERIODOS } from '../constantes/relatorio.js';
import { ROTAS } from '../constantes/rotas.js';
import { useRelatorioStore } from '../stores/index.jsx';
import { agruparPorDia, formatarDataLocal, formatarHoraLocal } from '../utils/datas.js';
import { formatarMoeda } from '../utils/moeda.js';
import '../estilos/relatorios.css';

// Pede confirmacao antes de excluir, porque o calculo some junto.
function ConfirmarExclusao({ relatorio, aoFechar, aoConfirmar }) {
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  async function confirmar() {
    setExcluindo(true);
    try {
      await aoConfirmar(relatorio.id);
      aoFechar();
    } catch (falha) {
      setErro(falha.message);
      setExcluindo(false);
    }
  }

  return (
    <Modal
      titulo={TEXTOS_RELATORIOS.CONFIRMAR_EXCLUSAO_TITULO}
      aoFechar={aoFechar}
      largura="estreita"
      rodape={
        <>
          <button type="button" className="botao botao--secundario" onClick={aoFechar}>
            Cancelar
          </button>
          <button type="button" className="botao botao--perigo" onClick={confirmar} disabled={excluindo}>
            Excluir
          </button>
        </>
      }
    >
      {erro && (
        <p className="aviso-erro" role="alert">
          {erro}
        </p>
      )}
      <p className="relatorios__confirmacao">
        {TEXTOS_RELATORIOS.CONFIRMAR_EXCLUSAO(relatorio.licitacao.numero, formatarDataLocal(relatorio.geradoEm))}
      </p>
    </Modal>
  );
}

// Figura C3 do TCC: central de relatorios.
export default observer(function Relatorios() {
  const relatorios = useRelatorioStore();
  const [aExcluir, setAExcluir] = useState(null);

  useEffect(() => {
    relatorios.carregar(1);
    relatorios.carregarLicitacoes();
  }, [relatorios]);

  const grupos = agruparPorDia(relatorios.itens, (item) => item.geradoEm);
  const vazio = !relatorios.carregando && relatorios.itens.length === 0;

  return (
    <section className="pagina">
      <div className="pagina__topo">
        <div>
          <h1 className="pagina__titulo">{TEXTOS_RELATORIOS.TITULO}</h1>
          <nav className="migalhas" aria-label="Você está em">
            <Link to={ROTAS.HOME}>
              <IconeCasa tamanho={16} /> Home
            </Link>
            <IconeChevron tamanho={14} />
            <span className="migalhas__atual">{TEXTOS_RELATORIOS.TITULO}</span>
          </nav>
        </div>
        <div className="relatorios__filtros">
          <select
            value={relatorios.filtros.dias}
            onChange={(e) => relatorios.filtrar('dias', e.target.value)}
            aria-label="Filtrar por período"
          >
            {PERIODOS.map(({ dias, rotulo }) => (
              <option key={rotulo} value={dias}>
                {rotulo}
              </option>
            ))}
          </select>
          <select
            value={relatorios.filtros.licitacaoId}
            onChange={(e) => relatorios.filtrar('licitacaoId', e.target.value)}
            aria-label="Filtrar por licitação"
          >
            <option value="">{TEXTOS_RELATORIOS.TODAS_LICITACOES}</option>
            {relatorios.licitacoes.map((licitacao) => (
              <option key={licitacao.id} value={licitacao.id}>
                Licitação {licitacao.numero} · {licitacao.orgao}
              </option>
            ))}
          </select>
        </div>
      </div>

      {relatorios.erro && (
        <p className="aviso-erro" role="alert">
          {relatorios.erro}
        </p>
      )}

      {relatorios.carregando && relatorios.itens.length === 0 && <p className="relatorios__vazio">{MENSAGENS.CARREGANDO}</p>}

      {vazio && (
        <div className="relatorios__vazio">
          <p>{relatorios.temFiltro ? TEXTOS_RELATORIOS.SEM_RESULTADO : TEXTOS_RELATORIOS.VAZIO}</p>
          {!relatorios.temFiltro && (
            <Link to={ROTAS.ORCAMENTO} className="botao botao--primario">
              {TEXTOS_RELATORIOS.NOVO_CALCULO}
            </Link>
          )}
        </div>
      )}

      {grupos.map((grupo) => (
        <section key={grupo.rotulo} className="cartao relatorios__grupo" aria-label={grupo.rotulo}>
          <h2 className="cartao__titulo">
            <IconeRelogio tamanho={22} />
            {grupo.rotulo}
          </h2>
          <ul className="relatorios__lista">
            {grupo.itens.map((relatorio) => {
              const baixado = Boolean(relatorio.baixadoEm);
              const baixando = relatorios.baixando === relatorio.id;
              return (
                <li key={relatorio.id} className="relatorio">
                  <IconePdf />
                  <div className="relatorio__licitacao">
                    <span>Licitação {relatorio.licitacao.numero}</span>
                    <small>{relatorio.licitacao.orgao}</small>
                  </div>
                  <div className="relatorio__data">
                    <span>{formatarDataLocal(relatorio.geradoEm)}</span>
                    <small>{formatarHoraLocal(relatorio.geradoEm)}</small>
                  </div>
                  <strong className="relatorio__valor">{formatarMoeda(relatorio.resultadoFinal)}</strong>
                  <button
                    type="button"
                    className={`relatorio__baixar ${baixado ? 'relatorio__baixar--feito' : ''}`}
                    title={baixado ? TEXTOS_RELATORIOS.DICA_FEITO : undefined}
                    disabled={baixando}
                    onClick={() => relatorios.baixar(relatorio)}
                  >
                    {baixando ? TEXTOS_RELATORIOS.BAIXANDO : baixado ? TEXTOS_RELATORIOS.FEITO : TEXTOS_RELATORIOS.BAIXAR}
                    {!baixando && (baixado ? <IconeCheck tamanho={14} /> : <IconeDownload tamanho={14} />)}
                  </button>
                  <Link
                    to={`${ROTAS.ORCAMENTO}/${relatorio.calculoId}`}
                    className="botao-icone"
                    title={TEXTOS_RELATORIOS.EDITAR}
                    aria-label={`${TEXTOS_RELATORIOS.EDITAR} (licitação ${relatorio.licitacao.numero})`}
                  >
                    <IconeEditar />
                  </Link>
                  <button
                    type="button"
                    className="botao-icone botao-icone--perigo"
                    title={TEXTOS_RELATORIOS.EXCLUIR}
                    aria-label={`${TEXTOS_RELATORIOS.EXCLUIR} (licitação ${relatorio.licitacao.numero})`}
                    onClick={() => setAExcluir(relatorio)}
                  >
                    <IconeLixeira />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <Paginacao pagina={relatorios.pagina} totalPaginas={relatorios.totalPaginas} aoMudar={(p) => relatorios.carregar(p)} />

      {aExcluir && (
        <ConfirmarExclusao relatorio={aExcluir} aoFechar={() => setAExcluir(null)} aoConfirmar={(id) => relatorios.excluir(id)} />
      )}
    </section>
  );
});
