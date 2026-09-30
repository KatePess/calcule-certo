import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CampoPercentual from '../componentes/CampoPercentual.jsx';
import { IconeChevron, IconeEditar, IconeLixeira, IconeMais } from '../componentes/Icones.jsx';
import ListaAlertas from '../componentes/ListaAlertas.jsx';
import { EMPRESA_VAZIA, OPCOES_PORTE, TAMANHO_MAXIMO_EMPRESA, UFS } from '../constantes/empresa.js';
import { MENSAGENS, TEXTOS_PAINEL, TEXTOS_PERFIL, VALIDACAO } from '../constantes/mensagens.js';
import { ITENS_PRIVACIDADE, SECAO_PADRAO, SECOES_PERFIL } from '../constantes/perfil.js';
import { ROTAS } from '../constantes/rotas.js';
import {
  OPCOES_TIPO_TAXA,
  ROTULOS_TIPO_TAXA,
  TAMANHO_MAXIMO_NOME_TAXA,
  TAXA_VAZIA,
} from '../constantes/taxa.js';
import { useEmpresaStore, usePainelStore, useSessaoStore, useTaxaStore } from '../stores/index.jsx';
import { formatarDataLocal } from '../utils/datas.js';
import { apenasDigitos, exibirCnpj, formatarCnpj, formatarTelefone } from '../utils/formatadores.js';
import { apiParaPercentual, formatarPercentual, percentualParaApi } from '../utils/moeda.js';
import {
  ehCnpjValido,
  ehEmailValido,
  ehNomeValido,
  ehSenhaValida,
  estaPreenchido,
  primeiroErro,
} from '../utils/validadores.js';
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

// O CNPJ e da empresa: fica em "Dados da empresa".
const DadosDaConta = observer(function DadosDaConta() {
  const sessao = useSessaoStore();
  const [nome, setNome] = useState(() => sessao.usuario.nome);
  const [retorno, setRetorno] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar(evento) {
    evento.preventDefault();
    if (!ehNomeValido(nome)) {
      setRetorno({ tipo: 'erro', texto: VALIDACAO.NOME });
      return;
    }
    setSalvando(true);
    try {
      await sessao.atualizarPerfil({ nome: nome.trim() });
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
      <p className="perfil__legenda">{TEXTOS_PERFIL.DADOS_LEGENDA}</p>
      <form className="formulario" onSubmit={salvar} noValidate>
        <Retorno retorno={retorno} />
        <div className="perfil__campos">
          <label className="formulario__campo">
            <span>Nome completo</span>
            <input value={nome} autoComplete="name" onChange={(e) => setNome(e.target.value)} />
          </label>
          <label className="formulario__campo">
            <span>E-mail</span>
            <input value={sessao.usuario.email} disabled />
            <span className="formulario__ajuda">O e-mail identifica a conta e não pode ser alterado.</span>
          </label>
        </div>
        <div>
          <button type="submit" className="botao botao--primario" disabled={salvando}>
            {TEXTOS_PERFIL.SALVAR_DADOS}
          </button>
        </div>
      </form>
    </section>
  );
});

// Dados vindos da API -> valores dos campos (texto, com mascara).
function empresaParaFormulario(empresa) {
  return {
    ...EMPRESA_VAZIA,
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia,
    cnpj: exibirCnpj(empresa.cnpj),
    inscricaoEstadual: empresa.inscricaoEstadual,
    emailCorporativo: empresa.emailCorporativo,
    telefone: formatarTelefone(empresa.telefone),
    funcionarios: empresa.funcionarios === null ? '' : String(empresa.funcionarios),
    porte: empresa.porte,
    ramoAtividade: empresa.ramoAtividade,
    cidade: empresa.cidade,
    uf: empresa.uf,
  };
}

// Conteudo principal de "Meu perfil". Nenhum campo e obrigatorio; o que for
// preenchido e conferido aqui e de novo no servidor.
const DadosDaEmpresa = observer(function DadosDaEmpresa() {
  const empresaStore = useEmpresaStore();
  const [form, setForm] = useState(null);
  const [retorno, setRetorno] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const { empresa } = empresaStore;

  useEffect(() => {
    empresaStore.carregar();
  }, [empresaStore]);

  // Preenche os campos quando os dados chegam da API.
  useEffect(() => {
    if (empresa && form === null) setForm(empresaParaFormulario(empresa));
  }, [empresa, form]);

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  async function salvar(evento) {
    evento.preventDefault();
    const digitosTelefone = apenasDigitos(form.telefone);
    const problema = primeiroErro([
      [ehCnpjValido(form.cnpj), VALIDACAO.CNPJ],
      [!estaPreenchido(form.emailCorporativo) || ehEmailValido(form.emailCorporativo.trim()), VALIDACAO.EMPRESA_EMAIL],
      [digitosTelefone.length === 0 || digitosTelefone.length >= 10, VALIDACAO.EMPRESA_TELEFONE],
    ]);
    if (problema) {
      setRetorno({ tipo: 'erro', texto: problema });
      return;
    }
    setSalvando(true);
    try {
      await empresaStore.salvar({ ...form, cnpj: apenasDigitos(form.cnpj), telefone: digitosTelefone });
      // Mostra os valores como o servidor gravou (ex.: e-mail em minusculas).
      setForm(empresaParaFormulario(empresaStore.empresa));
      setRetorno({ tipo: 'sucesso', texto: TEXTOS_PERFIL.EMPRESA_SALVA });
    } catch (falha) {
      setRetorno({ tipo: 'erro', texto: falha.message });
    } finally {
      setSalvando(false);
    }
  }

  const campoTexto = (chave, rotulo, extras = {}) => (
    <label className={`formulario__campo${extras.largo ? ' empresa-form__largo' : ''}`}>
      <span>{rotulo}</span>
      <input
        value={form[chave]}
        maxLength={TAMANHO_MAXIMO_EMPRESA[chave]}
        placeholder={extras.placeholder}
        autoComplete={extras.autoComplete ?? 'off'}
        type={extras.tipo ?? 'text'}
        onChange={(e) => alterar(chave, e.target.value)}
      />
    </label>
  );

  return (
    <section className="cartao" aria-labelledby="perfil-empresa">
      <h2 className="cartao__titulo" id="perfil-empresa">
        {TEXTOS_PERFIL.EMPRESA}
      </h2>
      <p className="perfil__legenda">{TEXTOS_PERFIL.EMPRESA_LEGENDA}</p>

      {empresaStore.erro && !form && (
        <p className="aviso-erro" role="alert">
          {empresaStore.erro}
        </p>
      )}
      {!form && !empresaStore.erro && <p className="perfil__vazio">{MENSAGENS.CARREGANDO}</p>}

      {form && (
        <form className="formulario empresa-form" onSubmit={salvar} noValidate>
          <Retorno retorno={retorno} />

          <fieldset className="empresa-form__grupo">
            <legend>{TEXTOS_PERFIL.GRUPO_IDENTIFICACAO}</legend>
            {campoTexto('razaoSocial', 'Razão social', {
              largo: true,
              autoComplete: 'organization',
              placeholder: 'Ex.: Kate Serviços Elétricos LTDA',
            })}
            {campoTexto('nomeFantasia', 'Nome fantasia', { placeholder: 'Como a empresa é conhecida' })}
            <label className="formulario__campo">
              <span>CNPJ</span>
              <input
                value={form.cnpj}
                inputMode="numeric"
                placeholder="00.000.000/0000-00"
                onChange={(e) => alterar('cnpj', formatarCnpj(e.target.value))}
              />
            </label>
            {campoTexto('inscricaoEstadual', 'Inscrição estadual', { placeholder: 'Número ou "ISENTO"' })}
          </fieldset>

          <fieldset className="empresa-form__grupo">
            <legend>{TEXTOS_PERFIL.GRUPO_ATUACAO}</legend>
            <label className="formulario__campo">
              <span>Porte da empresa</span>
              <select value={form.porte} onChange={(e) => alterar('porte', e.target.value)}>
                <option value="">Não informado</option>
                {OPCOES_PORTE.map(({ valor, rotulo }) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="formulario__campo">
              <span>Número de funcionários</span>
              <input
                value={form.funcionarios}
                inputMode="numeric"
                placeholder="Ex.: 12"
                onChange={(e) => alterar('funcionarios', apenasDigitos(e.target.value).slice(0, 7))}
              />
            </label>
            {campoTexto('ramoAtividade', 'Ramo de atividade', {
              largo: true,
              placeholder: 'Ex.: manutenção elétrica, locação de máquinas',
            })}
          </fieldset>

          {/* Em tela larga, contato e localizacao ficam lado a lado. */}
          <div className="empresa-form__par">
            <fieldset className="empresa-form__grupo">
              <legend>{TEXTOS_PERFIL.GRUPO_CONTATO}</legend>
              {campoTexto('emailCorporativo', 'E-mail corporativo', {
                tipo: 'email',
                autoComplete: 'email',
                placeholder: 'contato@suaempresa.com.br',
              })}
              <label className="formulario__campo">
                <span>Telefone</span>
                <input
                  value={form.telefone}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  onChange={(e) => alterar('telefone', formatarTelefone(e.target.value))}
                />
              </label>
            </fieldset>
            <fieldset className="empresa-form__grupo">
              <legend>{TEXTOS_PERFIL.GRUPO_LOCALIZACAO}</legend>
              {campoTexto('cidade', 'Cidade', { autoComplete: 'address-level2', placeholder: 'Ex.: Rio Branco' })}
              <label className="formulario__campo">
                <span>Estado (UF)</span>
                <select value={form.uf} onChange={(e) => alterar('uf', e.target.value)}>
                  <option value="">Não informado</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>
          </div>

          <div className="empresa-form__acoes">
            <button type="submit" className="botao botao--primario" disabled={salvando}>
              {TEXTOS_PERFIL.SALVAR_EMPRESA}
            </button>
            {empresa?.atualizadoEm && (
              <span className="formulario__ajuda">
                {TEXTOS_PERFIL.atualizadoEm(formatarDataLocal(empresa.atualizadoEm))}
              </span>
            )}
          </div>
        </form>
      )}
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
      <p className="perfil__legenda">{TEXTOS_PERFIL.SENHA_LEGENDA}</p>
      <form className="formulario" onSubmit={salvar} noValidate>
        <Retorno retorno={retorno} />
        <div className="perfil__campos">
          {campo('atual', TEXTOS_PERFIL.SENHA_ATUAL, 'current-password')}
          {campo('nova', TEXTOS_PERFIL.NOVA_SENHA, 'new-password')}
          {campo('confirmacao', TEXTOS_PERFIL.CONFIRMAR_SENHA, 'new-password')}
        </div>
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
    <section className="cartao" aria-labelledby="perfil-taxas">
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

// Licitacoes que abrem nos proximos 7 dias (os mesmos alertas do Painel).
const Notificacoes = observer(function Notificacoes() {
  const painel = usePainelStore();

  // Atualiza ao abrir, para nao mostrar alertas de quando a sessao comecou.
  useEffect(() => {
    painel.carregar();
  }, [painel]);

  return (
    <section className="cartao" aria-labelledby="perfil-notificacoes">
      <h2 className="cartao__titulo" id="perfil-notificacoes">
        {TEXTOS_PERFIL.NOTIFICACOES}
      </h2>
      <p className="perfil__legenda">{TEXTOS_PERFIL.NOTIFICACOES_LEGENDA}</p>
      {painel.erro && (
        <p className="aviso-erro" role="alert">
          {painel.erro}
        </p>
      )}
      {painel.carregado && painel.alertas.length === 0 && <p className="perfil__vazio">{TEXTOS_PAINEL.SEM_ALERTAS}</p>}
      <ListaAlertas alertas={painel.alertas} />
    </section>
  );
});

function Privacidade() {
  return (
    <section className="cartao" aria-labelledby="perfil-privacidade">
      <h2 className="cartao__titulo" id="perfil-privacidade">
        {TEXTOS_PERFIL.PRIVACIDADE}
      </h2>
      <p className="perfil__legenda">{TEXTOS_PERFIL.PRIVACIDADE_LEGENDA}</p>
      <dl className="privacidade">
        {ITENS_PRIVACIDADE.map(({ titulo, texto }) => (
          <div key={titulo}>
            <dt>{titulo}</dt>
            <dd>{texto}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// Conteudo de cada item do menu do perfil (aberto pelo nome, no menu lateral).
const CONTEUDO_DA_SECAO = {
  empresa: DadosDaEmpresa,
  dados: DadosDaConta,
  notificacoes: Notificacoes,
  privacidade: Privacidade,
  seguranca: TrocarSenha,
  taxas: TaxasSalvas,
};

// "Meu perfil": os dados da empresa e, pelo endereco (/perfil?secao=...),
// os outros itens do menu do perfil. O menu em si abre sobre o nome de quem
// esta logado, no rodape do menu lateral.
export default function Perfil() {
  const [parametros] = useSearchParams();
  const pedida = parametros.get('secao');
  const idAberta = CONTEUDO_DA_SECAO[pedida] ? pedida : SECAO_PADRAO;
  const secao = SECOES_PERFIL.find((item) => item.id === idAberta);
  const Conteudo = CONTEUDO_DA_SECAO[idAberta];

  return (
    <section className="pagina perfil">
      {idAberta !== SECAO_PADRAO && (
        <nav className="migalhas" aria-label="Você está em">
          <Link to={ROTAS.PERFIL}>{TEXTOS_PERFIL.TITULO}</Link>
          <IconeChevron tamanho={14} />
          <span className="migalhas__atual">{secao.rotulo}</span>
        </nav>
      )}
      <h1 className="pagina__titulo">{TEXTOS_PERFIL.TITULO}</h1>
      <Conteudo key={idAberta} />
    </section>
  );
}
