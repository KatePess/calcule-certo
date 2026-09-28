import { TAMANHO_PAGINA_MAXIMO, TAMANHO_PAGINA_PADRAO } from '../constantes/paginacao.js';

// Le ?pagina= e ?limite= da URL, sempre devolvendo valores seguros.
export function lerPaginacao(query = {}) {
  const pagina = Math.max(1, Number.parseInt(query.pagina, 10) || 1);
  const pedido = Number.parseInt(query.limite, 10) || TAMANHO_PAGINA_PADRAO;
  const limite = Math.min(Math.max(1, pedido), TAMANHO_PAGINA_MAXIMO);
  return { pagina, limite, deslocamento: (pagina - 1) * limite };
}

// Formato padrao de toda lista paginada da API.
export function montarPagina(itens, total, { pagina, limite }) {
  return {
    itens,
    pagina,
    total,
    totalPaginas: Math.max(1, Math.ceil(total / limite)),
  };
}

// Escapa % e _ para que a busca trate esses caracteres como texto comum.
export function termoDeBusca(texto) {
  return `%${texto.replace(/[\\%_]/g, '\\$&')}%`;
}
