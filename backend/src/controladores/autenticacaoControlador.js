import { STATUS } from '../constantes/http.js';
import { autenticacaoServico } from '../servicos/autenticacaoServico.js';

// Traduz requisicao HTTP em chamada de servico e o resultado de volta em
// resposta HTTP. Nao contem regra de negocio.
export const autenticacaoControlador = {
  async cadastrar(req, res, proximo) {
    try {
      const resultado = await autenticacaoServico.cadastrar(req.body);
      res.status(STATUS.CRIADO).json(resultado);
    } catch (erro) {
      proximo(erro);
    }
  },

  async login(req, res, proximo) {
    try {
      const resultado = await autenticacaoServico.autenticar(req.body);
      res.status(STATUS.OK).json(resultado);
    } catch (erro) {
      proximo(erro);
    }
  },

  async atualizarPerfil(req, res, proximo) {
    try {
      const usuario = await autenticacaoServico.atualizarPerfil(req.usuario.id, req.body);
      res.status(STATUS.OK).json({ usuario });
    } catch (erro) {
      proximo(erro);
    }
  },

  async trocarSenha(req, res, proximo) {
    try {
      await autenticacaoServico.trocarSenha(req.usuario.id, req.body);
      res.status(STATUS.SEM_CONTEUDO).end();
    } catch (erro) {
      proximo(erro);
    }
  },

  async usuarioLogado(req, res, proximo) {
    try {
      const usuario = await autenticacaoServico.buscarUsuarioLogado(req.usuario.id);
      res.status(STATUS.OK).json({ usuario });
    } catch (erro) {
      proximo(erro);
    }
  },
};
