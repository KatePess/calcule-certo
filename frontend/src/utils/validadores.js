import {
  FORMATO_EMAIL,
  QUANTIDADE_DIGITOS_CNPJ,
  TAMANHO_MINIMO_NOME,
  TAMANHO_MINIMO_SENHA,
} from '../constantes/validacao.js';
import { apenasDigitos } from './formatadores.js';

export function ehEmailValido(email) {
  return FORMATO_EMAIL.test(String(email ?? '').trim());
}

export function ehSenhaValida(senha) {
  return String(senha ?? '').length >= TAMANHO_MINIMO_SENHA;
}

export function ehNomeValido(nome) {
  return String(nome ?? '').trim().length >= TAMANHO_MINIMO_NOME;
}

// O CNPJ e opcional; quando preenchido, precisa estar completo.
export function ehCnpjValido(cnpj) {
  const digitos = apenasDigitos(cnpj);
  return digitos.length === 0 || digitos.length === QUANTIDADE_DIGITOS_CNPJ;
}
