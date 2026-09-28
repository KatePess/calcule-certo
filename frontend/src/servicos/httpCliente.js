import { BASE_API, METODOS, STATUS_HTTP } from '../constantes/api.js';
import { MENSAGENS } from '../constantes/mensagens.js';
import { lerToken } from '../utils/armazenamento.js';

// Funcao chamada quando uma requisicao autenticada volta 401 (token vencido).
// A SessaoStore registra aqui a propria acao de encerrar a sessao; assim este
// arquivo nao precisa importar a store, o que criaria importacao circular.
let aoExpirar = () => {};

export function aoExpirarSessao(callback) {
  aoExpirar = callback;
}

function montarUrl(caminho, parametros) {
  const url = `${BASE_API}${caminho}`;
  if (!parametros) return url;

  const busca = new URLSearchParams();
  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') busca.append(chave, valor);
  });
  const texto = busca.toString();
  return texto ? `${url}?${texto}` : url;
}

// Faz a requisicao e trata falha de rede e sessao expirada. Devolve a
// resposta crua, para que JSON e arquivos possam ser lidos de formas diferentes.
async function buscar(caminho, { metodo = METODOS.GET, corpo, autenticado = false, parametros } = {}) {
  const cabecalhos = {};
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
  if (autenticado) cabecalhos.Authorization = `Bearer ${lerToken()}`;

  let resposta;
  try {
    resposta = await fetch(montarUrl(caminho, parametros), {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new Error(MENSAGENS.SERVIDOR_INDISPONIVEL);
  }

  // So requisicoes autenticadas encerram a sessao. O 401 do login com senha
  // errada continua sendo tratado pela propria tela de login.
  if (autenticado && resposta.status === STATUS_HTTP.NAO_AUTORIZADO) {
    aoExpirar();
    throw new Error(MENSAGENS.SESSAO_EXPIRADA);
  }
  return resposta;
}

async function lerErro(resposta) {
  const dados = await resposta.json().catch(() => ({}));
  return new Error(dados.erro || MENSAGENS.ERRO_INESPERADO);
}

// Ponto unico de saida das requisicoes HTTP que trocam JSON.
export async function requisitar(caminho, opcoes = {}) {
  const resposta = await buscar(caminho, opcoes);
  if (!resposta.ok) throw await lerErro(resposta);
  if (resposta.status === STATUS_HTTP.SEM_CONTEUDO) return null;
  return resposta.json().catch(() => ({}));
}
