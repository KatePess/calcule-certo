import { STATUS } from '../constantes/http.js';
import { empresaServico } from '../servicos/empresaServico.js';

export const empresaControlador = {
  async obter(req, res, proximo) {
    try {
      res.status(STATUS.OK).json({ empresa: await empresaServico.obter(req.usuario.id) });
    } catch (erro) {
      proximo(erro);
    }
  },

  async salvar(req, res, proximo) {
    try {
      res.status(STATUS.OK).json({ empresa: await empresaServico.salvar(req.usuario.id, req.body) });
    } catch (erro) {
      proximo(erro);
    }
  },
};
