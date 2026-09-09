import { QUANTIDADE_DIGITOS_CNPJ } from '../constantes/validacao.js';

// Remove tudo que nao for digito.
export function apenasDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

// Formata o CNPJ enquanto o usuario digita: 00.000.000/0000-00
export function formatarCnpj(valor) {
  return apenasDigitos(valor)
    .slice(0, QUANTIDADE_DIGITOS_CNPJ)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

// "Kate Pessoa dos Santos" -> "Kate"
export function primeiroNome(nomeCompleto) {
  return String(nomeCompleto ?? '').trim().split(' ')[0];
}
