import { STATUS } from '../constantes/http.js';
import { painelServico } from '../servicos/painelServico.js';

export const painelControlador = {
  async obter(req, res, proximo) {
    try {
      res.status(STATUS.OK).json(await painelServico.obter(req.usuario.id, req.query));
    } catch (erro) {
      proximo(erro);
    }
  },
};
