import { STATUS } from '../constantes/http.js';
import { licitacaoServico } from '../servicos/licitacaoServico.js';

// Traduz requisicao HTTP em chamada de servico. Nao contem regra de negocio.
export const licitacaoControlador = {
  async listar(req, res, proximo) {
    try {
      res.status(STATUS.OK).json(await licitacaoServico.listar(req.usuario.id, req.query));
    } catch (erro) {
      proximo(erro);
    }
  },

  async obter(req, res, proximo) {
    try {
      const licitacao = await licitacaoServico.obter(req.usuario.id, req.params.id);
      res.status(STATUS.OK).json({ licitacao });
    } catch (erro) {
      proximo(erro);
    }
  },

  async cadastrar(req, res, proximo) {
    try {
      const licitacao = await licitacaoServico.cadastrar(req.usuario.id, req.body);
      res.status(STATUS.CRIADO).json({ licitacao });
    } catch (erro) {
      proximo(erro);
    }
  },

  async atualizar(req, res, proximo) {
    try {
      const licitacao = await licitacaoServico.atualizar(req.usuario.id, req.params.id, req.body);
      res.status(STATUS.OK).json({ licitacao });
    } catch (erro) {
      proximo(erro);
    }
  },

  async atualizarStatus(req, res, proximo) {
    try {
      const licitacao = await licitacaoServico.atualizarStatus(req.usuario.id, req.params.id, req.body?.status);
      res.status(STATUS.OK).json({ licitacao });
    } catch (erro) {
      proximo(erro);
    }
  },

  async excluir(req, res, proximo) {
    try {
      await licitacaoServico.excluir(req.usuario.id, req.params.id);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },
};
