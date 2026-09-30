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

// "68999991234" -> "(68) 99999-1234"; com 10 digitos, "(68) 3223-1234".
// Formata enquanto a pessoa digita.
export function formatarTelefone(valor) {
  const digitos = apenasDigitos(valor).slice(0, 11);
  if (digitos.length === 0) return '';
  if (digitos.length <= 2) return `(${digitos}`;
  const ddd = `(${digitos.slice(0, 2)}) `;
  if (digitos.length <= 6) return ddd + digitos.slice(2);
  const meio = digitos.length === 11 ? 7 : 6;
  return `${ddd}${digitos.slice(2, meio)}-${digitos.slice(meio)}`;
}

// "Kate Pessoa dos Santos" -> "Kate Santos" (cabe no rodape do menu lateral)
export function nomeCurto(nomeCompleto) {
  const partes = String(nomeCompleto ?? '').trim().split(/\s+/).filter(Boolean);
  return partes.length > 1 ? `${partes[0]} ${partes[partes.length - 1]}` : partes.join('');
}

// "Kate Pessoa dos Santos" -> "KS" (usado no avatar do menu lateral)
export function iniciais(nomeCompleto) {
  const partes = String(nomeCompleto ?? '').trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return `${partes[0][0]}${ultima}`.toUpperCase();
}

// "12345678000199" -> "12.345.678/0001-99"; vazio continua vazio.
export function exibirCnpj(cnpj) {
  return cnpj ? formatarCnpj(cnpj) : '';
}

// "2026-10-20" -> "20/10/2026", sem passar por Date (evita troca de dia por fuso).
export function formatarData(dataIso) {
  if (!dataIso) return '';
  const [ano, mes, dia] = String(dataIso).slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}
