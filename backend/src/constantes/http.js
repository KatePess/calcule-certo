// Codigos de status HTTP usados pela API.
export const STATUS = {
  OK: 200,
  CRIADO: 201,
  REQUISICAO_INVALIDA: 400,
  NAO_AUTORIZADO: 401,
  NAO_ENCONTRADO: 404,
  CONFLITO: 409,
  ERRO_INTERNO: 500,
};

// Codigo do PostgreSQL para violacao de restricao UNIQUE.
export const CODIGO_PG_DUPLICADO = '23505';

export const PREFIXO_TOKEN = 'Bearer';
