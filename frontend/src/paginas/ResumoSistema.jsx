import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import EtiquetaStatus from '../componentes/EtiquetaStatus.jsx';
import { Icone, IconeBusca, IconeMais } from '../componentes/Icones.jsx';
import LicitacaoModal from '../componentes/LicitacaoModal.jsx';
import Paginacao from '../componentes/Paginacao.jsx';
import { OPCOES_STATUS, STATUS_LICITACAO } from '../constantes/licitacao.js';
import { MENSAGENS, TEXTOS_RESUMO } from '../constantes/mensagens.js';
import { ESPERA_BUSCA_MS, TAMANHO_PAGINA } from '../constantes/paginacao.js';
import { useLicitacaoStore } from '../stores/index.jsx';
import { formatarData } from '../utils/formatadores.js';
import '../estilos/resumo.css';

// "undefined" = modal fechado; null = nova licitacao; objeto = edicao.
const MODAL_FECHADO = undefined;

export default observer(function ResumoSistema() {
  const licitacoes = useLicitacaoStore();
  const [emEdicao, setEmEdicao] = useState(MODAL_FECHADO);
  const [busca, setBusca] = useState(licitacoes.filtros.busca);

  useEffect(() => {
    licitacoes.carregar(1);
  }, [licitacoes]);

  // Busca so depois que a pessoa para de digitar.
  useEffect(() => {
    if (busca === licitacoes.filtros.busca) return undefined;
    const espera = setTimeout(() => licitacoes.filtrar('busca', busca.trim()), ESPERA_BUSCA_MS);
    return () => clearTimeout(espera);
  }, [busca, licitacoes]);

  const vazio = !licitacoes.carregando && licitacoes.itens.length === 0;

  return (
    <section className="pagina">
      <div className="pagina__topo">
        <div>
          <h1 className="pagina__titulo">{TEXTOS_RESUMO.TITULO}</h1>
          <p className="pagina__legenda">{TEXTOS_RESUMO.LEGENDA}</p>
        </div>
        <button type="button" className="botao botao--escuro" onClick={() => setEmEdicao(null)}>
          {TEXTOS_RESUMO.NOVA}
          <IconeMais tamanho={18} />
        </button>
      </div>

      <div className="filtros">
        <label className="filtros__busca">
          <IconeBusca />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={TEXTOS_RESUMO.BUSCA}
            aria-label={TEXTOS_RESUMO.BUSCA}
          />
        </label>
        <select
          value={licitacoes.filtros.status}
          onChange={(e) => licitacoes.filtrar('status', e.target.value)}
          aria-label="Filtrar por status"
        >
          <option value="">{TEXTOS_RESUMO.TODOS_STATUS}</option>
          {OPCOES_STATUS.map(({ valor, rotulo }) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
      </div>

      {licitacoes.erro && (
        <p className="aviso-erro" role="alert">
          {licitacoes.erro}
        </p>
      )}

      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th className="tabela__n tabela__opcional">N</th>
              <th>Licitação</th>
              <th className="tabela__opcional">Abertura</th>
              <th className="tabela__opcional" title="Cálculos salvos para a licitação">Quantidade</th>
              <th>Status</th>
              <th className="tabela__acao">
                <span className="visualmente-oculto">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {licitacoes.itens.map((licitacao, indice) => (
              <tr key={licitacao.id}>
                <td className="tabela__n tabela__opcional">{(licitacoes.pagina - 1) * TAMANHO_PAGINA + indice + 1}</td>
                <td>
                  <span className="tabela__principal">
                    Licitação {licitacao.numero} · {licitacao.orgao}
                  </span>
                  {licitacao.objeto && <span className="tabela__secundario">{licitacao.objeto}</span>}
                  {licitacao.dataAbertura && (
                    <span className="tabela__secundario tabela__so-celular">
                      Abertura: {formatarData(licitacao.dataAbertura)}
                    </span>
                  )}
                </td>
                <td className="tabela__opcional">{formatarData(licitacao.dataAbertura) || '—'}</td>
                <td className="tabela__opcional">{String(licitacao.quantidadeCalculos).padStart(2, '0')}</td>
                <td>
                  <EtiquetaStatus status={licitacao.status} />
                </td>
                <td className="tabela__acao">
                  <button
                    type="button"
                    className="botao-status"
                    title="Editar licitação"
                    aria-label={`Editar licitação ${licitacao.numero}`}
                    onClick={() => setEmEdicao(licitacao)}
                  >
                    <span className={`botao-status__icone etiqueta--${STATUS_LICITACAO[licitacao.status]?.tom}`}>
                      <Icone nome={STATUS_LICITACAO[licitacao.status]?.icone} tamanho={14} />
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {licitacoes.carregando && licitacoes.itens.length === 0 && <p className="tabela__vazio">{MENSAGENS.CARREGANDO}</p>}
        {vazio && (
          <p className="tabela__vazio">{licitacoes.temFiltro ? TEXTOS_RESUMO.SEM_RESULTADO : TEXTOS_RESUMO.VAZIO}</p>
        )}
      </div>

      <Paginacao
        pagina={licitacoes.pagina}
        totalPaginas={licitacoes.totalPaginas}
        aoMudar={(pagina) => licitacoes.carregar(pagina)}
      />

      {emEdicao !== MODAL_FECHADO && (
        <LicitacaoModal
          licitacao={emEdicao}
          aoFechar={() => setEmEdicao(MODAL_FECHADO)}
          aoSalvar={(dados, id) => licitacoes.salvar(dados, id)}
          aoExcluir={(id) => licitacoes.excluir(id)}
        />
      )}
    </section>
  );
});
