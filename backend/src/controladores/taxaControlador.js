import { STATUS } from '../constantes/http.js';
import { taxaServico } from '../servicos/taxaServico.js';

export const taxaControlador = {
  async listar(req, res, proximo) {
    try {
      res.status(STATUS.OK).json({ taxas: await taxaServico.listar(req.usuario.id) });
    } catch (erro) {
      proximo(erro);
    }
  },

  async cadastrar(req, res, proximo) {
    try {
      res.status(STATUS.CRIADO).json({ taxa: await taxaServico.salvarTaxa(req.usuario.id, req.body) });
    } catch (erro) {
      proximo(erro);
    }
  },

  async atualizar(req, res, proximo) {
    try {
      res.status(STATUS.OK).json({ taxa: await taxaServico.atualizarTaxa(req.usuario.id, req.params.id, req.body) });
    } catch (erro) {
      proximo(erro);
    }
  },

  async excluir(req, res, proximo) {
    try {
      await taxaServico.excluir(req.usuario.id, req.params.id);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },
};
