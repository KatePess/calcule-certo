// Caminhos expostos pela API.
export const CAMINHOS = {
  SAUDE: '/api/saude',
  AUTH: '/api/auth',
  LICITACOES: '/api/licitacoes',
  CALCULOS: '/api/calculos',
  RELATORIOS: '/api/relatorios',
  TAXAS: '/api/taxas',
  PAINEL: '/api/painel',
};

export const CAMINHOS_CALCULO = {
  SIMULAR: '/simular',
};

export const CAMINHOS_RELATORIO = {
  PDF: '/:id/pdf',
};

export const CAMINHOS_AUTH = {
  CADASTRAR: '/cadastrar',
  LOGIN: '/login',
  USUARIO_LOGADO: '/eu',
  PERFIL: '/perfil',
  SENHA: '/senha',
  ESQUECI_SENHA: '/esqueci-senha',
  REDEFINIR_SENHA: '/redefinir-senha',
};

// Padrao usado pelos modulos de cadastro (licitacoes, taxas...).
export const CAMINHOS_RECURSO = {
  RAIZ: '/',
  POR_ID: '/:id',
  STATUS: '/:id/status',
};
