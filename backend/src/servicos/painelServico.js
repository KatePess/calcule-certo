import { STATUS_ENCERRADOS } from '../constantes/licitacao.js';
import { PAINEL } from '../constantes/painel.js';
import { licitacaoRepositorio } from '../repositorios/licitacaoRepositorio.js';
import { relatorioRepositorio } from '../repositorios/relatorioRepositorio.js';
import { diasEntre, somarDias } from '../utils/datas.js';
import { dataIsoNoFuso } from '../utils/formatadores.js';
import { lerFuso } from '../utils/fuso.js';
import { licitacaoPublica } from './licitacaoServico.js';
import { relatorioPublico } from './relatorioServico.js';

// Dados do painel inicial: licitacoes e relatorios mais recentes e alertas
// de prazo. "Hoje" e calculado no fuso de quem esta usando.
export const painelServico = {
  async obter(usuarioId, query) {
    const hoje = dataIsoNoFuso(new Date(), lerFuso(query?.fuso));

    const [licitacoes, relatorios, alertas] = await Promise.all([
      licitacaoRepositorio.listar({ usuarioId, limite: PAINEL.LICITACOES_RECENTES, deslocamento: 0 }),
      relatorioRepositorio.listar({ usuarioId, limite: PAINEL.RELATORIOS_RECENTES, deslocamento: 0 }),
      licitacaoRepositorio.listarComAberturaEntre({
        usuarioId,
        desde: hoje,
        ate: somarDias(hoje, PAINEL.DIAS_ALERTA),
        statusIgnorados: STATUS_ENCERRADOS,
        limite: PAINEL.ALERTAS_MAXIMO,
      }),
    ]);

    return {
      hoje,
      totalLicitacoes: licitacoes.total,
      licitacoesRecentes: licitacoes.itens.map(licitacaoPublica),
      relatoriosRecentes: relatorios.itens.map(relatorioPublico),
      alertas: alertas.map((linha) => ({
        ...licitacaoPublica(linha),
        diasParaAbertura: diasEntre(hoje, linha.data_abertura),
      })),
    };
  },
};
