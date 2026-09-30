// Prefixo e endpoints da API. O prefixo /api e redirecionado pelo Vite
// para o servidor Express (ver vite.config.js).
export const BASE_API = '/api';

export const ENDPOINTS = {
  CADASTRAR: '/auth/cadastrar',
  LOGIN: '/auth/login',
  USUARIO_LOGADO: '/auth/eu',
  LICITACOES: '/licitacoes',
  licitacao: (id) => `/licitacoes/${id}`,
  statusLicitacao: (id) => `/licitacoes/${id}/status`,
  CALCULOS: '/calculos',
  SIMULAR_CALCULO: '/calculos/simular',
  calculo: (id) => `/calculos/${id}`,
  RELATORIOS: '/relatorios',
  relatorio: (id) => `/relatorios/${id}`,
  pdfRelatorio: (id) => `/relatorios/${id}/pdf`,
  TAXAS: '/taxas',
  taxa: (id) => `/taxas/${id}`,
  PAINEL: '/painel',
  PERFIL: '/auth/perfil',
  SENHA: '/auth/senha',
  EMPRESA: '/empresa',
  ESQUECI_SENHA: '/auth/esqueci-senha',
  REDEFINIR_SENHA: '/auth/redefinir-senha',
};

export const METODOS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const STATUS_HTTP = {
  SEM_CONTEUDO: 204,
  REQUISICAO_INVALIDA: 400,
  NAO_AUTORIZADO: 401,
};
