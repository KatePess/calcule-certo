import bcrypt from 'bcryptjs';
import { CUSTO_HASH } from '../constantes/validacao.js';

// A senha em texto puro nunca e gravada: so o hash gerado aqui.
export function gerarHash(senha) {
  return bcrypt.hash(senha, CUSTO_HASH);
}

export function conferirSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}
