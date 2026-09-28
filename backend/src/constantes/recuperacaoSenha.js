// Regras do "Esqueci minha senha".
export const VALIDADE_LINK_MINUTOS = 30;

// Um pedido por conta a cada minuto, para o formulario nao virar um jeito
// de lotar a caixa de entrada de alguem.
export const INTERVALO_ENTRE_PEDIDOS_SEGUNDOS = 60;

// 32 bytes aleatorios = 256 bits: impossivel de adivinhar por tentativa.
export const BYTES_TOKEN_RECUPERACAO = 32;

// Tela do front-end que recebe o link. Precisa bater com
// ROTAS.REDEFINIR_SENHA em frontend/src/constantes/rotas.js.
export const CAMINHO_TELA_REDEFINIR = '/redefinir-senha';
