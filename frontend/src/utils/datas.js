// Datas exibidas na tela, sempre no fuso de quem esta usando o navegador.
const UM_DIA_MS = 24 * 60 * 60 * 1000;

function inicioDoDia(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

// "30/10/2026"
export function formatarDataLocal(dataIso) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dataIso));
}

// "14:05"
export function formatarHoraLocal(dataIso) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(dataIso));
}

// "Hoje", "Ontem", "Anteontem" ou a data, como na Figura C3.
export function rotuloDoDia(dataIso, agora = new Date()) {
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(new Date(dataIso))) / UM_DIA_MS);
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  if (dias === 2) return 'Anteontem';
  return formatarDataLocal(dataIso);
}

// Agrupa itens ja ordenados do mais recente para o mais antigo.
export function agruparPorDia(itens, obterData, agora = new Date()) {
  const grupos = [];
  for (const item of itens) {
    const rotulo = rotuloDoDia(obterData(item), agora);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.rotulo === rotulo) ultimo.itens.push(item);
    else grupos.push({ rotulo, itens: [item] });
  }
  return grupos;
}

// Inicio do dia de (dias - 1) dias atras, em ISO. "Ultimos 7 dias" = hoje
// e os 6 dias anteriores, contados a partir da meia-noite local.
export function inicioDosUltimosDias(dias, agora = new Date()) {
  const inicio = inicioDoDia(agora);
  inicio.setDate(inicio.getDate() - (dias - 1));
  return inicio.toISOString();
}
