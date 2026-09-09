// Prefixo e endpoints da API. O prefixo /api e redirecionado pelo Vite
// para o servidor Express (ver vite.config.js).
export const BASE_API = '/api';

export const ENDPOINTS = {
  CADASTRAR: '/auth/cadastrar',
  LOGIN: '/auth/login',
  USUARIO_LOGADO: '/auth/eu',
};

export const METODOS = {
  GET: 'GET',
  POST: 'POST',
};
