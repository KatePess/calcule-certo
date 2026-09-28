import {
  FORMATO_EMAIL,
  QUANTIDADE_DIGITOS_CNPJ,
  TAMANHO_MINIMO_NOME,
  TAMANHO_MINIMO_SENHA,
} from '../constantes/validacao.js';

export function ehNomeValido(nome) {
  return nome.length >= TAMANHO_MINIMO_NOME;
}

export function ehEmailValido(email) {
  return FORMATO_EMAIL.test(email);
}

export function ehSenhaValida(senha) {
  return senha.length >= TAMANHO_MINIMO_SENHA;
}

// O CNPJ e opcional; quando preenchido, precisa estar completo.
export function ehCnpjValido(digitosCnpj) {
  return digitosCnpj.length === 0 || digitosCnpj.length === QUANTIDADE_DIGITOS_CNPJ;
}

// Data no formato AAAA-MM-DD que exista no calendario (recusa 2026-02-30).
export function ehDataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const [ano, mes, dia] = texto.split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}
