import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { baixarArquivo, requisitar } from './httpCliente.js';

export const relatorioServico = {
  listar({ pagina, de, licitacaoId } = {}) {
    return requisitar(ENDPOINTS.RELATORIOS, { autenticado: true, parametros: { pagina, de, licitacaoId } });
  },

  // Envia o fuso do navegador para que as datas do PDF batam com as da tela.
  baixarPdf(id) {
    return baixarArquivo(ENDPOINTS.pdfRelatorio(id), {
      nomePadrao: `relatorio-${id}.pdf`,
      parametros: { fuso: Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
  },

  excluir(id) {
    return requisitar(ENDPOINTS.relatorio(id), { metodo: METODOS.DELETE, autenticado: true });
  },
};
