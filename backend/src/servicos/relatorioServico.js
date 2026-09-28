import { AMBIENTE } from '../config/ambiente.js';
import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { calculoRepositorio } from '../repositorios/calculoRepositorio.js';
import { relatorioRepositorio } from '../repositorios/relatorioRepositorio.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { dataIsoNoFuso, textoLimpo } from '../utils/formatadores.js';
import { lerPaginacao, montarPagina } from '../utils/paginacao.js';
import { calculoPublico } from './calculoServico.js';
import { gerarPdf } from './pdfServico.js';

function naoEncontrado() {
  return new ErroDeAplicacao(ERROS.RELATORIO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO);
}

// "de" e "ate" chegam como data e hora ISO, calculadas pela tela no fuso
// de quem usa (ex.: inicio do dia de 7 dias atras).
function lerMomento(valor) {
  const texto = textoLimpo(valor);
  if (!texto) return null;
  if (Number.isNaN(Date.parse(texto))) throw new ErroDeAplicacao(ERROS.RELATORIO_PERIODO_INVALIDO, STATUS.REQUISICAO_INVALIDA);
  return new Date(texto).toISOString();
}

function lerLicitacaoId(valor) {
  const texto = textoLimpo(valor);
  if (!texto) return null;
  const id = Number(texto);
  if (!Number.isSafeInteger(id) || id <= 0) throw new ErroDeAplicacao(ERROS.RELATORIO_FILTRO_INVALIDO, STATUS.REQUISICAO_INVALIDA);
  return id;
}

export function relatorioPublico(linha) {
  return {
    id: linha.id,
    geradoEm: linha.gerado_em,
    baixadoEm: linha.baixado_em,
    calculoId: linha.calculo_id,
    resultadoFinal: linha.resultado_final,
    licitacao: {
      id: linha.licitacao_id,
      numero: linha.licitacao_numero,
      orgao: linha.licitacao_orgao,
    },
  };
}

// A tela informa o fuso de quem esta usando, para que as datas do PDF batam
// com as da tela. Fuso desconhecido ou ausente usa o padrao do servidor.
function lerFuso(valor) {
  const fuso = textoLimpo(valor);
  if (!fuso) return AMBIENTE.FUSO_HORARIO;
  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: fuso });
    return fuso;
  } catch {
    return AMBIENTE.FUSO_HORARIO;
  }
}

// Nome legivel e seguro para o arquivo: calculo-licitacao-1101-2026-10-30.pdf
function nomeDoArquivo(relatorio, fuso) {
  const numero = relatorio.licitacao_numero.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'sem-numero';
  return `calculo-licitacao-${numero}-${dataIsoNoFuso(relatorio.gerado_em, fuso)}.pdf`;
}

export const relatorioServico = {
  async listar(usuarioId, query) {
    const paginacao = lerPaginacao(query);
    const { itens, total } = await relatorioRepositorio.listar({
      usuarioId,
      de: lerMomento(query?.de),
      ate: lerMomento(query?.ate),
      licitacaoId: lerLicitacaoId(query?.licitacaoId),
      limite: paginacao.limite,
      deslocamento: paginacao.deslocamento,
    });
    return montarPagina(itens.map(relatorioPublico), total, paginacao);
  },

  // Classe RelatorioPDF do diagrama: disponibilizarDownload(). O PDF e
  // gerado na hora, a partir do calculo gravado, e nao fica guardado em disco.
  async disponibilizarDownload(usuarioId, id, fusoInformado) {
    const fuso = lerFuso(fusoInformado);
    const relatorio = await relatorioRepositorio.buscarPorId(id, usuarioId);
    if (!relatorio) throw naoEncontrado();

    const [linhaCalculo, usuario] = await Promise.all([
      calculoRepositorio.buscarPorId(relatorio.calculo_id, usuarioId),
      usuarioRepositorio.buscarPorId(usuarioId),
    ]);

    const conteudo = await gerarPdf({
      calculo: calculoPublico(linhaCalculo),
      usuario,
      geradoEm: new Date(),
      fuso,
    });
    await relatorioRepositorio.marcarBaixado(id);

    return { nomeArquivo: nomeDoArquivo(relatorio, fuso), conteudo };
  },

  // Excluir o relatorio exclui o calculo; o relatorio sai junto pelo
  // ON DELETE CASCADE. Um relatorio sem calculo nao teria o que mostrar.
  async excluir(usuarioId, id) {
    const relatorio = await relatorioRepositorio.buscarPorId(id, usuarioId);
    if (!relatorio) throw naoEncontrado();
    await calculoRepositorio.excluir(relatorio.calculo_id, usuarioId);
  },
};
