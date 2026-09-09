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
