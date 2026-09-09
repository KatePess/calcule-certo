import { CHAVE_TOKEN } from '../constantes/armazenamento.js';

// Isola o acesso ao armazenamento do navegador.
// lembrar = true  -> localStorage   (a sessao sobrevive ao fechar o navegador)
// lembrar = false -> sessionStorage (a sessao acaba quando a aba e fechada)
export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN) || sessionStorage.getItem(CHAVE_TOKEN);
}

export function guardarToken(token, lembrar) {
  limparToken();
  (lembrar ? localStorage : sessionStorage).setItem(CHAVE_TOKEN, token);
}

export function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN);
  sessionStorage.removeItem(CHAVE_TOKEN);
}
