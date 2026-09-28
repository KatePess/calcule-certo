// Botoes numerados de pagina, como no Resumo do sistema do prototipo.
// Mostra no maximo 5 numeros por vez, centrados na pagina atual.
export default function Paginacao({ pagina, totalPaginas, aoMudar }) {
  if (totalPaginas <= 1) return null;

  const inicio = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
  const numeros = [];
  for (let n = inicio; n <= Math.min(totalPaginas, inicio + 4); n += 1) numeros.push(n);

  return (
    <nav className="paginacao" aria-label="Paginação">
      {numeros.map((numero) => (
        <button
          key={numero}
          type="button"
          className={`paginacao__botao ${numero === pagina ? 'paginacao__botao--atual' : ''}`}
          aria-current={numero === pagina ? 'page' : undefined}
          onClick={() => aoMudar(numero)}
        >
          {numero}
        </button>
      ))}
    </nav>
  );
}
