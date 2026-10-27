import { useState } from 'react';
import { LICITACAO_VAZIA, OPCOES_STATUS, TAMANHO_MAXIMO_LICITACAO } from '../constantes/licitacao.js';
import { TEXTOS_LICITACAO, VALIDACAO } from '../constantes/mensagens.js';
import { estaPreenchido, primeiroErro } from '../utils/validadores.js';
import Modal from './Modal.jsx';

function paraFormulario(licitacao) {
  if (!licitacao) return { ...LICITACAO_VAZIA };
  return {
    numero: licitacao.numero,
    orgao: licitacao.orgao,
    objeto: licitacao.objeto ?? '',
    dataAbertura: licitacao.dataAbertura ?? '',
    status: licitacao.status,
  };
}

// Cadastro e edicao de licitacao. Usado no Resumo do sistema e no seletor da
// tela de calculo. "aoExcluir" e opcional: sem ele, o botao de excluir some.
export default function LicitacaoModal({ licitacao, aoFechar, aoSalvar, aoExcluir }) {
  const editando = Boolean(licitacao);
  const [form, setForm] = useState(() => paraFormulario(licitacao));
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function executar(acao) {
    setErro('');
    setEnviando(true);
    try {
      await acao();
      aoFechar();
    } catch (falha) {
      setErro(falha.message);
      setEnviando(false);
    }
  }

  function aoEnviar(evento) {
    evento.preventDefault();
    const problema = primeiroErro([
      [estaPreenchido(form.numero), VALIDACAO.LICITACAO_NUMERO],
      [estaPreenchido(form.orgao), VALIDACAO.LICITACAO_ORGAO],
      [form.objeto.length <= TAMANHO_MAXIMO_LICITACAO.OBJETO, VALIDACAO.LICITACAO_OBJETO],
    ]);
    if (problema) {
      setErro(problema);
      return;
    }
    executar(() => aoSalvar(form, licitacao?.id));
  }

  const rodape = confirmandoExclusao ? (
    <>
      <p className="modal__pergunta">{TEXTOS_LICITACAO.CONFIRMAR_EXCLUSAO(licitacao.numero)}</p>
      <button type="button" className="botao botao--secundario" onClick={() => setConfirmandoExclusao(false)}>
        Cancelar
      </button>
      <button type="button" className="botao botao--perigo" disabled={enviando} onClick={() => executar(() => aoExcluir(licitacao.id))}>
        Excluir
      </button>
    </>
  ) : (
    <>
      {editando && aoExcluir && (
        <button type="button" className="botao botao--texto-perigo" onClick={() => setConfirmandoExclusao(true)}>
          {TEXTOS_LICITACAO.EXCLUIR}
        </button>
      )}
      <button type="button" className="botao botao--secundario" onClick={aoFechar}>
        Cancelar
      </button>
      <button type="submit" form="form-licitacao" className="botao botao--primario" disabled={enviando}>
        {enviando ? TEXTOS_LICITACAO.SALVANDO : TEXTOS_LICITACAO.SALVAR}
      </button>
    </>
  );

  return (
    <Modal titulo={editando ? TEXTOS_LICITACAO.TITULO_EDITAR : TEXTOS_LICITACAO.TITULO_NOVA} aoFechar={aoFechar} rodape={rodape}>
      <form id="form-licitacao" className="formulario" onSubmit={aoEnviar} noValidate>
        {erro && (
          <p className="aviso-erro" role="alert">
            {erro}
          </p>
        )}

        <div className="formulario__linha">
          <label className="formulario__campo">
            <span>Número *</span>
            <input
              value={form.numero}
              maxLength={TAMANHO_MAXIMO_LICITACAO.NUMERO}
              onChange={(e) => alterar('numero', e.target.value)}
              placeholder="Ex.: 1101"
              autoFocus
            />
          </label>
          <label className="formulario__campo">
            <span>Data de abertura</span>
            <input type="date" value={form.dataAbertura} onChange={(e) => alterar('dataAbertura', e.target.value)} />
          </label>
        </div>

        <label className="formulario__campo">
          <span>Órgão *</span>
          <input
            value={form.orgao}
            maxLength={TAMANHO_MAXIMO_LICITACAO.ORGAO}
            onChange={(e) => alterar('orgao', e.target.value)}
            placeholder="Ex.: DERACRE"
          />
        </label>

        <label className="formulario__campo">
          <span>Objeto</span>
          <input
            value={form.objeto}
            maxLength={TAMANHO_MAXIMO_LICITACAO.OBJETO}
            onChange={(e) => alterar('objeto', e.target.value)}
            placeholder="Ex.: Manutenção corretiva de retroescavadeira"
          />
        </label>

        <label className="formulario__campo">
          <span>Status</span>
          <select value={form.status} onChange={(e) => alterar('status', e.target.value)}>
            {OPCOES_STATUS.map(({ valor, rotulo }) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </label>
      </form>
    </Modal>
  );
}
