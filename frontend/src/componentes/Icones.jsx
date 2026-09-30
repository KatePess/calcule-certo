// Icones em SVG inline: evitam dependencia extra e acompanham a cor do texto.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ tamanho, children }) {
  return (
    <svg {...base} width={tamanho ?? base.width} height={tamanho ?? base.height} aria-hidden="true">
      {children}
    </svg>
  );
}

export function IconePessoa({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

export function IconeOlho() {
  return (
    <Svg>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconeOlhoCortado() {
  return (
    <Svg>
      <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.2M6.6 6.6A18.4 18.4 0 0 0 2 12s3.6 7 10 7a10.4 10.4 0 0 0 4.3-.9" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="m3 3 18 18" />
    </Svg>
  );
}

export function IconeCasa({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11h5v-6h4v6h5V9" />
    </Svg>
  );
}

export function IconeCartao({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M2.5 9.5h19" />
    </Svg>
  );
}

export function IconePasta({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M3 7.5V18a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 18V9.5A1.5 1.5 0 0 0 19.5 8H12l-2-2.5H4.5A1.5 1.5 0 0 0 3 7Z" />
      <path d="M7 4h6.5" />
    </Svg>
  );
}

export function IconeResumo({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </Svg>
  );
}

export function IconeSair({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </Svg>
  );
}

export function IconeBusca() {
  return (
    <Svg>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export function IconeAjuda({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.9" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function IconeSino({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
      <path d="M10.3 20a2 2 0 0 0 3.4 0" />
    </Svg>
  );
}

export function IconePredio({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M16 9h2a2 2 0 0 1 2 2v10" />
      <path d="M2.5 21h19" />
      <path d="M8 7.5h4M8 11.5h4M8 15.5h4" />
    </Svg>
  );
}

export function IconeCadeado({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      <path d="M12 14.5v2.5" />
    </Svg>
  );
}

export function IconeEscudo({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M12 21s7.5-3.2 7.5-9.5V5.2L12 2.5 4.5 5.2v6.3C4.5 17.8 12 21 12 21Z" />
      <path d="m9 11.8 2.1 2.1L15.2 9.8" />
    </Svg>
  );
}

export function IconePercentual({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M19 5 5 19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </Svg>
  );
}

export function IconeEngrenagem({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </Svg>
  );
}

export function IconeMenu() {
  return (
    <Svg tamanho={22}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  );
}

export function IconeMais({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconeFechar({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Svg>
  );
}

export function IconeCheck({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function IconeRelogio({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  );
}

export function IconeExclamacao({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M12 4v10" />
      <path d="M12 19h.01" />
    </Svg>
  );
}

export function IconeAndamento({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 4v5h-5" />
    </Svg>
  );
}

export function IconeEditar({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </Svg>
  );
}

export function IconeLixeira({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </Svg>
  );
}

export function IconeDownload({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M12 4v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 20h14" />
    </Svg>
  );
}

export function IconeSetaDireita({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Svg>
  );
}

export function IconeChevron({ tamanho }) {
  return (
    <Svg tamanho={tamanho}>
      <path d="m9 6 6 6-6 6" />
    </Svg>
  );
}

// Arquivo PDF vermelho, como na Figura C3.
export function IconePdf() {
  return (
    <svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">
      <path d="M3 0h14l9 9v18a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3Z" fill="#E5322D" />
      <path d="M17 0v6a3 3 0 0 0 3 3h6Z" fill="#B3221E" />
      <text x="13" y="22" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">PDF</text>
    </svg>
  );
}

export function IconeGoogle({ tamanho = 19 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.7l7.8 6.1C12.3 13.9 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.15-3.2-.4-4.7H24v9h12.7c-.55 3-2.2 5.5-4.7 7.2l7.6 5.9c4.4-4.1 6.9-10.2 6.9-17.4Z" />
      <path fill="#FBBC05" d="M10.4 28.4a14.5 14.5 0 0 1 0-8.6l-7.8-6.1a24 24 0 0 0 0 20.8l7.8-6.1Z" />
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.6-5.6l-7.6-5.9c-2.1 1.4-4.8 2.3-8 2.3-6.4 0-11.7-4.4-13.6-10.3l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5Z" />
    </svg>
  );
}

export function IconeLinkedin({ tamanho = 19 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.4H4.7V19h2.4V9.4Zm-1.2-3.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM19.3 19h-2.4v-4.7c0-1.2-.4-2-1.5-2-.8 0-1.3.55-1.5 1.1-.1.2-.1.5-.1.8V19h-2.4s.03-8.1 0-9.6h2.4v1.4c.3-.5 1-1.2 2.4-1.2 1.8 0 3.1 1.15 3.1 3.6V19Z"
      />
    </svg>
  );
}

// Permite escolher o icone pelo nome guardado nas constantes (menu, status).
const POR_NOME = {
  casa: IconeCasa,
  cartao: IconeCartao,
  pasta: IconePasta,
  pessoa: IconePessoa,
  resumo: IconeResumo,
  check: IconeCheck,
  relogio: IconeRelogio,
  exclamacao: IconeExclamacao,
  andamento: IconeAndamento,
  fechar: IconeFechar,
  sino: IconeSino,
  predio: IconePredio,
  cadeado: IconeCadeado,
  escudo: IconeEscudo,
  percentual: IconePercentual,
  ajuda: IconeAjuda,
};

export function Icone({ nome, tamanho }) {
  const Componente = POR_NOME[nome];
  return Componente ? <Componente tamanho={tamanho} /> : null;
}
