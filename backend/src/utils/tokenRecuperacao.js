import { createHash, randomBytes } from 'node:crypto';
import { BYTES_TOKEN_RECUPERACAO } from '../constantes/recuperacaoSenha.js';

// O token vai no link do e-mail; o banco guarda so o hash dele.
// Aqui basta SHA-256 (e nao bcrypt, como na senha): o token ja e aleatorio e
// longo, entao nao ha o que adivinhar, e o hash rapido permite buscar por ele.
export function hashDoTokenRecuperacao(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function gerarTokenRecuperacao() {
  const token = randomBytes(BYTES_TOKEN_RECUPERACAO).toString('base64url');
  return { token, hash: hashDoTokenRecuperacao(token) };
}
