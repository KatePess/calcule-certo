// Caminhos expostos pela API.
export const CAMINHOS = {
  SAUDE: '/api/saude',
  AUTH: '/api/auth',
  LICITACOES: '/api/licitacoes',
};

export const CAMINHOS_AUTH = {
  CADASTRAR: '/cadastrar',
  LOGIN: '/login',
  USUARIO_LOGADO: '/eu',
};

// Padrao usado pelos modulos de cadastro (licitacoes, taxas...).
export const CAMINHOS_RECURSO = {
  RAIZ: '/',
  POR_ID: '/:id',
  STATUS: '/:id/status',
};
