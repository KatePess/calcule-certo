import { CODIGO_PG_DUPLICADO, STATUS } from '../constantes/http.js';
import {
  LISTA_STATUS_LICITACAO,
  STATUS_LICITACAO,
  TAMANHO_MAXIMO_LICITACAO,
} from '../constantes/licitacao.js';
import { ERROS } from '../constantes/mensagens.js';
import { licitacaoRepositorio } from '../repositorios/licitacaoRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { textoLimpo, textoOuNulo } from '../utils/formatadores.js';
import { lerPaginacao, montarPagina } from '../utils/paginacao.js';
import { ehDataValida } from '../utils/validadores.js';

function invalido(mensagem) {
  return new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

function naoEncontrada() {
  return new ErroDeAplicacao(ERROS.LICITACAO_NAO_ENCONTRADA, STATUS.NAO_ENCONTRADO);
}

function validarStatus(status) {
  if (!LISTA_STATUS_LICITACAO.includes(status)) {
    throw invalido(ERROS.LICITACAO_STATUS_INVALIDO);
  }
}

// Limpa e valida os campos de uma licitacao vindos do cliente.
function lerDados(dados, statusPadrao) {
  const numero = textoLimpo(dados?.numero);
  const orgao = textoLimpo(dados?.orgao);
  const objeto = textoOuNulo(dados?.objeto);
  const status = textoLimpo(dados?.status) || statusPadrao;
  const dataAbertura = textoOuNulo(dados?.dataAbertura);

  if (!numero) throw invalido(ERROS.LICITACAO_NUMERO_OBRIGATORIO);
  if (numero.length > TAMANHO_MAXIMO_LICITACAO.NUMERO) throw invalido(ERROS.LICITACAO_NUMERO_LONGO);
  if (!orgao) throw invalido(ERROS.LICITACAO_ORGAO_OBRIGATORIO);
  if (orgao.length > TAMANHO_MAXIMO_LICITACAO.ORGAO) throw invalido(ERROS.LICITACAO_ORGAO_LONGO);
  if (objeto && objeto.length > TAMANHO_MAXIMO_LICITACAO.OBJETO) throw invalido(ERROS.LICITACAO_OBJETO_LONGO);
  validarStatus(status);
  if (dataAbertura && !ehDataValida(dataAbertura)) throw invalido(ERROS.LICITACAO_DATA_INVALIDA);

  return { numero, orgao, objeto, status, dataAbertura };
}

function tratarDuplicidade(erro) {
  if (erro.code === CODIGO_PG_DUPLICADO) {
    throw new ErroDeAplicacao(ERROS.LICITACAO_DUPLICADA, STATUS.CONFLITO);
  }
  throw erro;
}

// Converte a linha do banco (snake_case) para o formato da API (camelCase).
export function licitacaoPublica(linha) {
  return {
    id: linha.id,
    numero: linha.numero,
    orgao: linha.orgao,
    objeto: linha.objeto,
    status: linha.status,
    dataAbertura: linha.data_abertura,
    criadoEm: linha.criado_em,
    atualizadoEm: linha.atualizado_em,
  };
}

// Regras de negocio da licitacao. cadastrar() e atualizarStatus() sao os
// metodos propostos para a classe Licitacao no diagrama de classes.
export const licitacaoServico = {
  async listar(usuarioId, query) {
    const paginacao = lerPaginacao(query);
    const status = textoLimpo(query?.status) || null;
    const busca = textoLimpo(query?.busca).slice(0, TAMANHO_MAXIMO_LICITACAO.BUSCA) || null;
    if (status) validarStatus(status);

    const { itens, total } = await licitacaoRepositorio.listar({
      usuarioId,
      status,
      busca,
      limite: paginacao.limite,
      deslocamento: paginacao.deslocamento,
    });
    return montarPagina(itens.map(licitacaoPublica), total, paginacao);
  },

  async obter(usuarioId, id) {
    const linha = await licitacaoRepositorio.buscarPorId(id, usuarioId);
    if (!linha) throw naoEncontrada();
    return licitacaoPublica(linha);
  },

  async cadastrar(usuarioId, dados) {
    const campos = lerDados(dados, STATUS_LICITACAO.EDITAL_ABERTO);
    try {
      return licitacaoPublica(await licitacaoRepositorio.inserir({ usuarioId, ...campos }));
    } catch (erro) {
      return tratarDuplicidade(erro);
    }
  },

  async atualizar(usuarioId, id, dados) {
    const atual = await licitacaoRepositorio.buscarPorId(id, usuarioId);
    if (!atual) throw naoEncontrada();

    const campos = lerDados(dados, atual.status);
    try {
      return licitacaoPublica(await licitacaoRepositorio.atualizar(id, usuarioId, campos));
    } catch (erro) {
      return tratarDuplicidade(erro);
    }
  },

  async atualizarStatus(usuarioId, id, status) {
    const novoStatus = textoLimpo(status);
    validarStatus(novoStatus);
    const linha = await licitacaoRepositorio.atualizarStatus(id, usuarioId, novoStatus);
    if (!linha) throw naoEncontrada();
    return licitacaoPublica(linha);
  },

  async excluir(usuarioId, id) {
    const excluiu = await licitacaoRepositorio.excluir(id, usuarioId);
    if (!excluiu) throw naoEncontrada();
  },
};
