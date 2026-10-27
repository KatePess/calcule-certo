// Normalizacoes aplicadas aos dados que chegam do cliente.
export function apenasDigitos(valor) {
  return String(valor ?? '').replace(/\D/g, '');
}

export function textoLimpo(valor) {
  return String(valor ?? '').trim();
}

export function emailNormalizado(valor) {
  return textoLimpo(valor).toLowerCase();
}

// Texto vazio vira null, para gravar "sem valor" no banco em vez de ''.
export function textoOuNulo(valor) {
  const texto = textoLimpo(valor);
  return texto === '' ? null : texto;
}

// Remove o hash da senha antes de devolver o usuario ao cliente.
export function usuarioPublico({ id, nome, email, cnpj }) {
  return { id, nome, email, cnpj };
}

// ---------- Formatos brasileiros, usados no PDF ----------

// "1266.67" -> "R$ 1.266,67"; "-15.00" -> "-R$ 15,00". Trabalha com texto,
// sem converter para number, para nao introduzir erro de arredondamento.
export function formatarMoedaBR(valor) {
  const texto = String(valor);
  const negativo = texto.startsWith('-');
  const [inteiro, decimal = '00'] = (negativo ? texto.slice(1) : texto).split('.');
  const milhares = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negativo ? '-' : ''}R$ ${milhares},${decimal.padEnd(2, '0')}`;
}

// "12.5" -> "12,5%"
export function formatarPercentualBR(valor) {
  return `${String(valor).replace('.', ',')}%`;
}

// "12345678000199" -> "12.345.678/0001-99"
export function formatarCnpjBR(cnpj) {
  const d = apenasDigitos(cnpj);
  if (d.length !== 14) return cnpj ?? '';
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

// Data e hora no fuso informado: "30/10/2026 14:05".
export function formatarDataHoraBR(data, fuso) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: fuso,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(data)).replace(',', '');
}

// Data no formato AAAA-MM-DD no fuso informado, usada em nomes de arquivo.
export function dataIsoNoFuso(data, fuso) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(data),
  );
}

// Data no fuso informado: "30/10/2026".
export function formatarDataBR(data, fuso) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, day: '2-digit', month: '2-digit', year: 'numeric' }).format(
    new Date(data),
  );
}

// Data por extenso, usada no local e data da proposta: "30 de outubro de 2026".
export function formatarDataExtensoBR(data, fuso) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(data),
  );
}

// "68999991234" -> "(68) 99999-1234"; "6832241234" -> "(68) 3224-1234".
export function formatarTelefoneBR(telefone) {
  const d = apenasDigitos(telefone);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone ?? '';
}
