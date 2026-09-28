import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';

// Usado com router.param('id', validarId). Um :id que nao seja inteiro
// positivo nunca vai existir no banco, entao responde 404 antes de consultar.
export function validarId(req, _res, proximo, valor) {
  const id = Number(valor);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return proximo(new ErroDeAplicacao(ERROS.REGISTRO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO));
  }
  req.params.id = id;
  return proximo();
}
