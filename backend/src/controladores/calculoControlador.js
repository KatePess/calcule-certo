import { STATUS } from '../constantes/http.js';
import { calculoServico } from '../servicos/calculoServico.js';

export const calculoControlador = {
  simular(req, res, proximo) {
    try {
      res.status(STATUS.OK).json(calculoServico.simular(req.body));
    } catch (erro) {
      proximo(erro);
    }
  },

  async salvar(req, res, proximo) {
    try {
      res.status(STATUS.CRIADO).json(await calculoServico.salvar(req.usuario.id, req.body));
    } catch (erro) {
      proximo(erro);
    }
  },

  async obter(req, res, proximo) {
    try {
      const calculo = await calculoServico.obter(req.usuario.id, req.params.id);
      res.status(STATUS.OK).json({ calculo });
    } catch (erro) {
      proximo(erro);
    }
  },
};
