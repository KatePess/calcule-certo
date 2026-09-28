import Decimal from 'decimal.js';
import { CASAS_DINHEIRO } from '../constantes/calculo.js';

// Copia isolada do Decimal com precisao folgada e arredondamento "meio para
// cima", o usual em valores monetarios. Nunca usar number para dinheiro:
// em JavaScript, 0.1 + 0.2 da 0.30000000000000004.
export const Dec = Decimal.clone({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export const ZERO = new Dec(0);
export const CEM = new Dec(100);

export function paraDecimal(valor) {
  return new Dec(valor);
}

export function arredondarCentavos(valor) {
  return new Dec(valor).toDecimalPlaces(CASAS_DINHEIRO, Dec.ROUND_HALF_UP);
}

// Formato da API: texto com duas casas, ex. "1266.67".
export function emTextoMonetario(valor) {
  return arredondarCentavos(valor).toFixed(CASAS_DINHEIRO);
}

// Percentual sem zeros sobrando: "5.0000" -> "5", "12.5000" -> "12.5".
export function emTextoPercentual(valor) {
  return new Dec(valor).toString();
}

export function percentualDe(valor, percentual) {
  return new Dec(valor).times(percentual).dividedBy(CEM);
}
