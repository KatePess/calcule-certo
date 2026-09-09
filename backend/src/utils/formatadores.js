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

// Remove o hash da senha antes de devolver o usuario ao cliente.
export function usuarioPublico({ id, nome, email, cnpj }) {
  return { id, nome, email, cnpj };
}
