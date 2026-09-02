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

export function IconePessoa() {
  return (
    <svg {...base} aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function IconeOlho() {
  return (
    <svg {...base} aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconeOlhoCortado() {
  return (
    <svg {...base} aria-hidden="true">
      <path d="M9.9 5.2A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.2M6.6 6.6A18.4 18.4 0 0 0 2 12s3.6 7 10 7a10.4 10.4 0 0 0 4.3-.9" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="m3 3 18 18" />
    </svg>
  );
}

export function IconeGoogle() {
  return (
    <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2.5 24 .5 14.6.5 6.5 5.9 2.6 13.7l7.8 6.1C12.3 13.9 17.6 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.15-3.2-.4-4.7H24v9h12.7c-.55 3-2.2 5.5-4.7 7.2l7.6 5.9c4.4-4.1 6.9-10.2 6.9-17.4Z" />
      <path fill="#FBBC05" d="M10.4 28.4a14.5 14.5 0 0 1 0-8.6l-7.8-6.1a24 24 0 0 0 0 20.8l7.8-6.1Z" />
      <path fill="#34A853" d="M24 47.5c6.2 0 11.5-2 15.6-5.6l-7.6-5.9c-2.1 1.4-4.8 2.3-8 2.3-6.4 0-11.7-4.4-13.6-10.3l-7.8 6.1C6.5 42.1 14.6 47.5 24 47.5Z" />
    </svg>
  );
}

export function IconeLinkedin() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.4H4.7V19h2.4V9.4Zm-1.2-3.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM19.3 19h-2.4v-4.7c0-1.2-.4-2-1.5-2-.8 0-1.3.55-1.5 1.1-.1.2-.1.5-.1.8V19h-2.4s.03-8.1 0-9.6h2.4v1.4c.3-.5 1-1.2 2.4-1.2 1.8 0 3.1 1.15 3.1 3.6V19Z"
      />
    </svg>
  );
}
