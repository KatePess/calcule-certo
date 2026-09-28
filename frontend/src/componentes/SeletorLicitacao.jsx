import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { TEXTOS_CALCULO } from '../constantes/mensagens.js';
import { useCalculoStore } from '../stores/index.jsx';
import { IconeMais } from './Icones.jsx';
import LicitacaoModal from './LicitacaoModal.jsx';

// Escolha da licitacao no topo da tela de calculo. O botao de nova licitacao
// reaproveita o mesmo modal usado no Resumo do sistema.
export default observer(function SeletorLicitacao() {
  const calculo = useCalculoStore();
  const [criando, setCriando] = useState(false);

  return (
    <div className="seletor-licitacao">
      <label className="seletor-licitacao__campo">
        <span>Licitação</span>
        <select
          value={calculo.licitacaoId}
          onChange={(evento) => calculo.selecionarLicitacao(evento.target.value)}
          disabled={calculo.carregandoLicitacoes}
        >
          <option value="">{TEXTOS_CALCULO.ESCOLHA_LICITACAO}</option>
          {calculo.licitacoes.map((licitacao) => (
            <option key={licitacao.id} value={licitacao.id}>
              Licitação {licitacao.numero} · {licitacao.orgao}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="botao botao--secundario" onClick={() => setCriando(true)}>
        <IconeMais tamanho={16} />
        Nova licitação
      </button>

      {!calculo.carregandoLicitacoes && calculo.licitacoes.length === 0 && (
        <p className="seletor-licitacao__vazio">{TEXTOS_CALCULO.SEM_LICITACAO}</p>
      )}

      {criando && (
        <LicitacaoModal
          licitacao={null}
          aoFechar={() => setCriando(false)}
          aoSalvar={(dados) => calculo.criarLicitacao(dados)}
        />
      )}
    </div>
  );
});
