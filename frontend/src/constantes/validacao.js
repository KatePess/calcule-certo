// Regras de validacao usadas nos formularios.
// Precisam continuar iguais as do back-end (backend/src/constantes/validacao.js).
export const TAMANHO_MINIMO_SENHA = 8;
export const TAMANHO_MINIMO_NOME = 3;
export const QUANTIDADE_DIGITOS_CNPJ = 14;

export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validade do link de "Esqueci minha senha" (VALIDADE_LINK_MINUTOS no back-end).
export const VALIDADE_LINK_RECUPERACAO_MINUTOS = 30;
