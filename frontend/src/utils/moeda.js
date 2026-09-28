// Conversoes entre o formato brasileiro da tela ("1.266,67") e o formato da
// API ("1266.67"). Tudo e feito com texto, sem converter para number, para
// nunca introduzir erro de arredondamento no caminho.
import { CASAS_PERCENTUAL, DIGITOS_MAXIMOS_MOEDA } from '../constantes/calculo.js';

function agruparMilhares(inteiro) {
  return inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Mascara de digitacao em centavos: "1" -> "0,01", "126667" -> "1.266,67".
export function mascararMoeda(digitado) {
  const bruto = String(digitado ?? '').replace(/\D/g, '');
  if (!bruto) return '';
  // Zero e um valor valido (ex.: sem custo variavel), por isso "0" vira "0,00".
  const digitos = (bruto.replace(/^0+/, '') || '0').slice(0, DIGITOS_MAXIMOS_MOEDA);
  const completo = digitos.padStart(3, '0');
  return `${agruparMilhares(completo.slice(0, -2))},${completo.slice(-2)}`;
}

// "1.266,67" -> "1266.67"; vazio continua vazio.
export function moedaParaApi(texto) {
  if (!texto) return '';
  return texto.replace(/\./g, '').replace(',', '.');
}

// "1266.67" (API) -> "1.266,67" (campo da tela).
export function apiParaMoeda(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const [inteiro, decimal = ''] = String(valor).split('.');
  return `${agruparMilhares(inteiro)},${decimal.padEnd(2, '0').slice(0, 2)}`;
}

// "1266.67" -> "R$ 1.266,67"; "-15.00" -> "-R$ 15,00".
export function formatarMoeda(valor) {
  if (valor === null || valor === undefined || valor === '') return '—';
  const texto = String(valor);
  const negativo = texto.startsWith('-');
  return `${negativo ? '-' : ''}R$ ${apiParaMoeda(negativo ? texto.slice(1) : texto)}`;
}

// Digitacao de percentual: so digitos e uma virgula, ate 4 casas decimais.
export function mascararPercentual(digitado) {
  const limpo = String(digitado ?? '').replace('.', ',').replace(/[^\d,]/g, '');
  const [inteiro, ...resto] = limpo.split(',');
  const inteiroCurto = inteiro.slice(0, 2);
  if (resto.length === 0) return inteiroCurto;
  return `${inteiroCurto || '0'},${resto.join('').slice(0, CASAS_PERCENTUAL)}`;
}

// "12,5" -> "12.5"; "10," -> "10".
export function percentualParaApi(texto) {
  if (!texto) return '';
  return texto.replace(',', '.').replace(/\.$/, '');
}

// "12.5" (API) -> "12,5" (campo da tela).
export function apiParaPercentual(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  return String(valor).replace('.', ',');
}

// "12.5" -> "12,5%".
export function formatarPercentual(valor) {
  return `${apiParaPercentual(valor)}%`;
}
