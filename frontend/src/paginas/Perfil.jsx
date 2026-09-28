import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import CampoPercentual from '../componentes/CampoPercentual.jsx';
import { IconeEditar, IconeLixeira, IconeMais } from '../componentes/Icones.jsx';
import { TEXTOS_PERFIL, VALIDACAO } from '../constantes/mensagens.js';
import {
  OPCOES_TIPO_TAXA,
  ROTULOS_TIPO_TAXA,
  TAMANHO_MAXIMO_NOME_TAXA,
  TAXA_VAZIA,
} from '../constantes/taxa.js';
import { useSessaoStore, useTaxaStore } from '../stores/index.jsx';
import { apenasDigitos, exibirCnpj, formatarCnpj } from '../utils/formatadores.js';
import { apiParaPercentual, formatarPercentual, percentualParaApi } from '../utils/moeda.js';
import { ehCnpjValido, ehNomeValido, ehSenhaValida, estaPreenchido, primeiroErro } from '../utils/validadores.js';
import '../estilos/perfil.css';

// Mensagem de erro ou de sucesso de cada formulario.
function Retorno({ retorno }) {
  if (!retorno) return null;
  return (
    <p className={retorno.tipo === 'erro' ? 'aviso-erro' : 'aviso-sucesso'} role={retorno.tipo === 'erro' ? 'alert' : 'status'}>
      {retorno.texto}
    </p>
  );
}

const DadosDaConta = observer(function DadosDaConta() {
  const sessao = useSessaoStore();
  const [form, setForm] = useState(() => ({ nome: sessao.usuario.nome, cnpj: exibirCnpj(sessao.usuario.cnpj) }));
  const [retorno, setRetorno] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    const problema = primeiroErro([
      [ehNomeValido(form.nome), VALIDACAO.NOME],
      [ehCnpjValido(form.cnpj), VALIDACAO.CNPJ],
    ]);
    if (problema) {
      setRetorno({ tipo: 'erro', texto: problema });
      return;
    }
    setSalvando(true);
    try {
      await sessao.atualizarPerfil({ nome: form.nome.trim(), cnpj: apenasDigitos(form.cnpj) });
      setRetorno({ tipo: 'sucesso', texto: TEXTOS_PERFIL.DADOS_SALVOS });
    } catch (falha) {
      setRetorno({ tipo: 'erro', texto: falha.message });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="cartao" aria-labelledby="perfil-dados">
      <h2 className="cartao__titulo" id="perfil-dados">
        {TEXTOS_PERFIL.DADOS}
      </h2>
      <form className="formulario" onSubmit={salvar} noValidate>
        <Retorno retorno={retorno} />
        <label className="formulario__campo">
          <span>Nome completo</span>
          <input value={form.nome} autoComplete="name" onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </label>
        <label className="formulario__campo">
          <span>E-mail</span>
          <input value={sessao.usuario.email} disabled />
          <span className="formulario__ajuda">O e-mail identifica a conta e não pode ser alterado.</span>
        </label>
        <label className="formulario__campo">
          <span>CNPJ</span>
          <input
            value={form.cnpj}
            inputMode="numeric"
            placeholder="Opcional"
            onChange={(e) => setForm({ ...form, cnpj: formatarCnpj(e.target.value) })}
          />
        </label>
        <div>
          <button type="submit" className="botao botao--primario" disabled={salvando}>
            {TEXTOS_PERFIL.SALVAR_DADOS}
          </button>
        </div>
      </form>
    </section>
  );
});

const TrocarSenha = observer(function TrocarSenha() {
  const sessao = useSessaoStore();
  const vazio = { atual: '', nova: '', confirmacao: '' };
  const [form, setForm] = useState(vazio);
  const [retorno, setRetorno] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    const problema = primeiroErro([
      [estaPreenchido(form.atual), VALIDACAO.SENHA_VAZIA],
      [ehSenhaValida(form.nova), VALIDACAO.SENHA_CURTA],
      [form.nova === form.confirmacao, TEXTOS_PERFIL.SENHAS_DIFERENTES],
    ]);
    if (problema) {
      setRetorno({ tipo: 'erro', texto: problema });
      return;
    }
    setSalvando(true);
    try {
      await sessao.trocarSenha(form.atual, form.nova);
      setForm(vazio);
      setRetorno({ tipo: 'sucesso', texto: TEXTOS_PERFIL.SENHA_TROCADA });
    } catch (falha) {
      setRetorno({ tipo: 'erro', texto: falha.message });
    } finally {
      setSalvando(false);
    }
  }

  const campo = (chave, rotulo, autoComplete) => (
    <label className="formulario__campo">
      <span>{rotulo}</span>
      <input type="password" value={form[chave]} autoComplete={autoComplete} onChange={(e) => setForm({ ...form, [chave]: e.target.value })} />
    </label>
  );

  return (
    <section className="cartao" aria-labelledby="perfil-senha">
      <h2 className="cartao__titulo" id="perfil-senha">
        {TEXTOS_PERFIL.SENHA}
      </h2>
      <form className="formulario" onSubmit={salvar} noValidate>
        <Retorno retorno={retorno} />
        {campo('atual', TEXTOS_PERFIL.SENHA_ATUAL, 'current-password')}
        {campo('nova', TEXTOS_PERFIL.NOVA_SENHA, 'new-password')}
        {campo('confirmacao', TEXTOS_PERFIL.CONFIRMAR_SENHA, 'new-password')}
        <div>
          <button type="submit" className="botao botao--primario" disabled={salvando}>
            {TEXTOS_PERFIL.SALVAR_SENHA}
          </button>
        </div>
      </form>
    </section>
  );
});

// Formulario de criar/editar uma taxa salva, exibido dentro da lista.
function FormularioTaxa({ taxa, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(() =>
    taxa ? { nome: taxa.nome, percentual: apiParaPercentual(taxa.percentual), tipo: taxa.tipo } : { ...TAXA_VAZIA },
  );
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    const problema = primeiroErro([
      [estaPreenchido(form.nome), TEXTOS_PERFIL.NOME_TAXA_VAZIO],
      [estaPreenchido(form.percentual), TEXTOS_PERFIL.PERCENTUAL_VAZIO],
    ]);
    if (problema) {
      setErro(problema);
      return;
    }
    setSalvando(true);
    try {
      await aoSalvar({ nome: form.nome.trim(), percentual: percentualParaApi(form.percentual), tipo: form.tipo }, taxa?.id);
    } catch (falha) {
      setErro(falha.message);
      setSalvando(false);
    }
  }

  return (
    <form className="taxa-form" onSubmit={salvar} noValidate>
      {erro && (
        <p className="aviso-erro" role="alert">
          {erro}
        </p>
      )}
      <div className="taxa-form__campos">
        <label className="formulario__campo">
          <span>Nome</span>
          <input
            value={form.nome}
            maxLength={TAMANHO_MAXIMO_NOME_TAXA}
            placeholder="Ex.: Plataforma BLL"
            autoFocus
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </label>
        <label className="formulario__campo">
          <span>Usar como</span>
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {OPCOES_TIPO_TAXA.map(({ valor, rotulo }) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </label>
        <CampoPercentual
          id={`percentual-${taxa?.id ?? 'nova'}`}
          rotulo="Percentual"
          valor={form.percentual}
          placeholder="Ex.: 1,5"
          aoMudar={(valor) => setForm({ ...form, percentual: valor })}
        />
      </div>
      <div className="taxa-form__acoes">
        <button type="button" className="botao botao--secundario botao--pequeno" onClick={aoCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao--primario botao--pequeno" disabled={salvando}>
          Salvar
        </button>
      </div>
    </form>
  );
}

const TaxasSalvas = observer(function TaxasSalvas() {
  const taxas = useTaxaStore();
  // null = nenhum formulario aberto; 'nova' = cadastro; numero = edicao.
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    taxas.carregar();
  }, [taxas]);

  async function salvar(dados, id) {
    await taxas.salvar(dados, id);
    setEditando(null);
  }

  async function excluir(id) {
    setErro('');
    try {
      await taxas.excluir(id);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <section className="cartao perfil__taxas" aria-labelledby="perfil-taxas">
      <h2 className="cartao__titulo" id="perfil-taxas">
        {TEXTOS_PERFIL.TAXAS}
      </h2>
      <p className="perfil__legenda">{TEXTOS_PERFIL.TAXAS_LEGENDA}</p>
      {(erro || taxas.erro) && (
        <p className="aviso-erro" role="alert">
          {erro || taxas.erro}
        </p>
      )}

      {taxas.carregado && taxas.taxas.length === 0 && editando !== 'nova' && <p className="perfil__legenda">{TEXTOS_PERFIL.SEM_TAXAS}</p>}

      <ul className="taxas">
        {taxas.taxas.map((taxa) =>
          editando === taxa.id ? (
            <li key={taxa.id}>
              <FormularioTaxa taxa={taxa} aoSalvar={salvar} aoCancelar={() => setEditando(null)} />
            </li>
          ) : (
            <li key={taxa.id} className="taxa">
              <div>
                <span className="taxa__nome">{taxa.nome}</span>
                <small>{ROTULOS_TIPO_TAXA[taxa.tipo]}</small>
              </div>
              <strong>{formatarPercentual(taxa.percentual)}</strong>
              <button type="button" className="botao-icone" aria-label={`Editar ${taxa.nome}`} onClick={() => setEditando(taxa.id)}>
                <IconeEditar />
              </button>
              <button type="button" className="botao-icone botao-icone--perigo" aria-label={`Excluir ${taxa.nome}`} onClick={() => excluir(taxa.id)}>
                <IconeLixeira />
              </button>
            </li>
          ),
        )}
        {editando === 'nova' && (
          <li>
            <FormularioTaxa aoSalvar={salvar} aoCancelar={() => setEditando(null)} />
          </li>
        )}
      </ul>

      {editando === null && (
        <button type="button" className="botao botao--secundario" onClick={() => setEditando('nova')}>
          <IconeMais tamanho={16} />
          {TEXTOS_PERFIL.NOVA_TAXA}
        </button>
      )}
    </section>
  );
});

export default function Perfil() {
  return (
    <section className="pagina">
      <h1 className="pagina__titulo">{TEXTOS_PERFIL.TITULO}</h1>
      <div className="perfil">
        <DadosDaConta />
        <TrocarSenha />
        <TaxasSalvas />
      </div>
    </section>
  );
}
