import { STATUS } from '../constantes/http.js';
import { relatorioServico } from '../servicos/relatorioServico.js';

export const relatorioControlador = {
  async listar(req, res, proximo) {
    try {
      res.status(STATUS.OK).json(await relatorioServico.listar(req.usuario.id, req.query));
    } catch (erro) {
      proximo(erro);
    }
  },

  async baixar(req, res, proximo) {
    try {
      const { nomeArquivo, conteudo } = await relatorioServico.disponibilizarDownload(req.usuario.id, req.params.id);
      res.status(STATUS.OK);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);
      // Permite que a tela leia o nome do arquivo ao baixar.
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.send(conteudo);
    } catch (erro) {
      proximo(erro);
    }
  },

  async excluir(req, res, proximo) {
    try {
      await relatorioServico.excluir(req.usuario.id, req.params.id);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },
};
