import { AMBIENTE } from '../config/ambiente.js';
import { textoLimpo } from './formatadores.js';

// A tela informa o fuso de quem esta usando (ex.: "America/Sao_Paulo"),
// para que datas calculadas no servidor batam com as da tela. Fuso ausente ou
// desconhecido usa o padrao do servidor.
export function lerFuso(valor) {
  const fuso = textoLimpo(valor);
  if (!fuso) return AMBIENTE.FUSO_HORARIO;
  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: fuso });
    return fuso;
  } catch {
    return AMBIENTE.FUSO_HORARIO;
  }
}
