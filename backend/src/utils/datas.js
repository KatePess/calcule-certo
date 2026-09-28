// Contas com datas no formato AAAA-MM-DD, feitas em UTC para que horario de
// verao ou fuso nunca desloquem o dia.
const UM_DIA_MS = 24 * 60 * 60 * 1000;

function paraUtc(dataIso) {
  const [ano, mes, dia] = dataIso.split('-').map(Number);
  return Date.UTC(ano, mes - 1, dia);
}

export function somarDias(dataIso, dias) {
  return new Date(paraUtc(dataIso) + dias * UM_DIA_MS).toISOString().slice(0, 10);
}

export function diasEntre(inicioIso, fimIso) {
  return Math.round((paraUtc(fimIso) - paraUtc(inicioIso)) / UM_DIA_MS);
}
