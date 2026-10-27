import jwt from 'jsonwebtoken';
import { AMBIENTE } from '../config/ambiente.js';

export function gerarToken({ id, nome, email }) {
  return jwt.sign({ id, nome, email }, AMBIENTE.JWT.segredo, {
    expiresIn: AMBIENTE.JWT.expiracao,
  });
}

export function verificarToken(token) {
  return jwt.verify(token, AMBIENTE.JWT.segredo);
}

// "state" do login social: prova, na volta do Google/LinkedIn, que o login
// comecou nesta API e para qual provedor. Vale poucos minutos.
const FINALIDADE_ESTADO_SOCIAL = 'login-social';

export function gerarEstadoSocial(provedor, validade) {
  return jwt.sign({ provedor, finalidade: FINALIDADE_ESTADO_SOCIAL }, AMBIENTE.JWT.segredo, {
    expiresIn: validade,
  });
}

// Devolve true so se o state for valido, nao expirado e do mesmo provedor.
export function conferirEstadoSocial(estado, provedor) {
  try {
    const dados = jwt.verify(String(estado ?? ''), AMBIENTE.JWT.segredo);
    return dados.finalidade === FINALIDADE_ESTADO_SOCIAL && dados.provedor === provedor;
  } catch {
    return false;
  }
}
