import { AMBIENTE } from '../config/ambiente.js';
import { CODIGO_PG_DUPLICADO, STATUS } from '../constantes/http.js';
import { PROVEDORES_SOCIAIS, VALIDADE_ESTADO_SOCIAL } from '../constantes/loginSocial.js';
import { ERROS } from '../constantes/mensagens.js';
import { CAMINHOS } from '../constantes/rotas.js';
import { TAMANHO_MINIMO_NOME } from '../constantes/validacao.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { emailNormalizado, textoLimpo } from '../utils/formatadores.js';
import { conferirEstadoSocial, gerarEstadoSocial, gerarToken } from '../utils/token.js';

const TAMANHO_MAXIMO_NOME = 120;

// Login com Google e LinkedIn pelo fluxo "authorization code" do OAuth 2.0:
// 1. iniciar: a API manda a pessoa para a tela de login do provedor;
// 2. retorno: o provedor devolve um codigo, que a API troca pelos dados da
//    pessoa (nome e e-mail). O segredo do app nunca passa pelo navegador.
// Se ja existe conta com aquele e-mail, a pessoa entra nela; senao, uma conta
// nova e criada sem senha.
export const loginSocialServico = {
  // Valida o provedor e devolve as configuracoes dele.
  provedor(chave) {
    if (!Object.hasOwn(PROVEDORES_SOCIAIS, chave)) {
      throw new ErroDeAplicacao(ERROS.SOCIAL_PROVEDOR_INVALIDO, STATUS.REQUISICAO_INVALIDA);
    }
    const provedor = PROVEDORES_SOCIAIS[chave];
    const credenciais = AMBIENTE.LOGIN_SOCIAL[chave];
    if (!credenciais.clienteId || !credenciais.segredo) {
      throw new ErroDeAplicacao(ERROS.SOCIAL_NAO_CONFIGURADO(provedor.nome), STATUS.REQUISICAO_INVALIDA);
    }
    return { ...provedor, ...credenciais };
  },

  urlRetorno(chave) {
    return `${AMBIENTE.URL_API}${CAMINHOS.AUTH}/social/${chave}/retorno`;
  },

  urlAutorizacao(chave) {
    const provedor = this.provedor(chave);
    const parametros = new URLSearchParams({
      response_type: 'code',
      client_id: provedor.clienteId,
      redirect_uri: this.urlRetorno(chave),
      scope: provedor.escopos,
      state: gerarEstadoSocial(chave, VALIDADE_ESTADO_SOCIAL),
      ...provedor.parametrosExtras,
    });
    return `${provedor.urlAutorizacao}?${parametros}`;
  },

  // Recebe a query da volta (code, state ou error) e devolve o token de sessao.
  async concluir(chave, { code, state, error }) {
    const provedor = this.provedor(chave);
    if (error || !code) {
      throw new ErroDeAplicacao(ERROS.SOCIAL_CANCELADO(provedor.nome), STATUS.REQUISICAO_INVALIDA);
    }
    if (!conferirEstadoSocial(state, chave)) {
      throw new ErroDeAplicacao(ERROS.SOCIAL_EXPIRADO, STATUS.REQUISICAO_INVALIDA);
    }

    let dados;
    try {
      const tokenProvedor = await trocarCodigo(provedor, String(code), this.urlRetorno(chave));
      dados = await buscarDadosDaPessoa(provedor, tokenProvedor);
    } catch (erro) {
      console.error(`Login com ${provedor.nome} falhou:`, erro.message);
      throw new ErroDeAplicacao(ERROS.SOCIAL_FALHA(provedor.nome), STATUS.ERRO_INTERNO);
    }

    const email = emailNormalizado(dados.email);
    // So aceita e-mail confirmado pelo provedor; senao alguem poderia entrar
    // na conta de outra pessoa informando o e-mail dela.
    if (!email || dados.email_verified === false || dados.email_verified === 'false') {
      throw new ErroDeAplicacao(ERROS.SOCIAL_SEM_EMAIL(provedor.nome), STATUS.REQUISICAO_INVALIDA);
    }

    const usuario = await encontrarOuCriar(email, nomeDaPessoa(dados, email));
    return { token: gerarToken(usuario) };
  },
};

async function trocarCodigo(provedor, codigo, urlRetorno) {
  const resposta = await fetch(provedor.urlToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: codigo,
      redirect_uri: urlRetorno,
      client_id: provedor.clienteId,
      client_secret: provedor.segredo,
    }),
  });
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok || !corpo.access_token) {
    throw new Error(`token ${resposta.status} ${corpo.error ?? ''} ${corpo.error_description ?? ''}`.trim());
  }
  return corpo.access_token;
}

async function buscarDadosDaPessoa(provedor, tokenProvedor) {
  const resposta = await fetch(provedor.urlUsuario, {
    headers: { Authorization: `Bearer ${tokenProvedor}` },
  });
  if (!resposta.ok) throw new Error(`userinfo ${resposta.status}`);
  return resposta.json();
}

// Usa o nome da conta; se vier vazio, a parte do e-mail antes do @.
function nomeDaPessoa(dados, email) {
  const nome = textoLimpo(dados.name || [dados.given_name, dados.family_name].filter(Boolean).join(' '));
  const escolhido = nome.length >= TAMANHO_MINIMO_NOME ? nome : email.split('@')[0];
  return escolhido.slice(0, TAMANHO_MAXIMO_NOME);
}

async function encontrarOuCriar(email, nome) {
  const existente = await usuarioRepositorio.buscarPorEmail(email);
  if (existente) return existente;
  try {
    return await usuarioRepositorio.inserir({ nome, email, senhaHash: null, cnpj: null });
  } catch (erro) {
    // Dois logins ao mesmo tempo com o mesmo e-mail: o outro ja criou a conta.
    if (erro.code === CODIGO_PG_DUPLICADO) return usuarioRepositorio.buscarPorEmail(email);
    throw erro;
  }
}
