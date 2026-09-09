// Regras de validacao do cadastro.
// Precisam continuar iguais as do front-end (frontend/src/constantes/validacao.js).
export const TAMANHO_MINIMO_SENHA = 8;
export const TAMANHO_MINIMO_NOME = 3;
export const QUANTIDADE_DIGITOS_CNPJ = 14;

export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custo do hash bcrypt. Quanto maior, mais lento de quebrar por forca bruta.
export const CUSTO_HASH = 10;
