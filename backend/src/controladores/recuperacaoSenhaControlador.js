import { STATUS } from '../constantes/http.js';
import { recuperacaoSenhaServico } from '../servicos/recuperacaoSenhaServico.js';

export const recuperacaoSenhaControlador = {
  // Sempre 204, exista ou nao a conta (ver recuperacaoSenhaServico.solicitar).
  async solicitar(req, res, proximo) {
    try {
      await recuperacaoSenhaServico.solicitar(req.body);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },

  async redefinir(req, res, proximo) {
    try {
      await recuperacaoSenhaServico.redefinir(req.body);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },
};
