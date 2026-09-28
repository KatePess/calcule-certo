import { TAMANHO_MAXIMO_LICITACAO } from './licitacao.js';
import { QUANTIDADE_DIGITOS_CNPJ, TAMANHO_MINIMO_SENHA } from './validacao.js';

// Textos que chegam ao usuario. Por isso ficam com acentuacao correta.
export const ERROS = {
  NOME_INVALIDO: 'Informe o nome completo.',
  EMAIL_INVALIDO: 'Informe um e-mail válido.',
  SENHA_CURTA: `A senha precisa ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  CNPJ_INVALIDO: `O CNPJ deve ter ${QUANTIDADE_DIGITOS_CNPJ} dígitos.`,
  CAMPOS_LOGIN_VAZIOS: 'Preencha o e-mail e a senha.',
  EMAIL_JA_CADASTRADO: 'Já existe uma conta com este e-mail.',
  // Mensagem generica de proposito: nao revela se o e-mail existe no sistema.
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
  FALHA_CADASTRO: 'Não foi possível concluir o cadastro.',
  FALHA_LOGIN: 'Não foi possível entrar agora. Tente novamente.',
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado.',
  TOKEN_AUSENTE: 'Token de acesso não enviado.',
  TOKEN_INVALIDO: 'Sessão expirada ou token inválido.',
  ROTA_NAO_ENCONTRADA: 'Rota não encontrada.',
  ERRO_INESPERADO: 'Erro inesperado no servidor. Tente novamente.',
  JSON_INVALIDO: 'Os dados enviados não estão em um formato válido.',
  REGISTRO_NAO_ENCONTRADO: 'Registro não encontrado.',

  LICITACAO_NAO_ENCONTRADA: 'Licitação não encontrada.',
  LICITACAO_NUMERO_OBRIGATORIO: 'Informe o número da licitação.',
  LICITACAO_NUMERO_LONGO: `O número da licitação pode ter até ${TAMANHO_MAXIMO_LICITACAO.NUMERO} caracteres.`,
  LICITACAO_ORGAO_OBRIGATORIO: 'Informe o órgão responsável pela licitação.',
  LICITACAO_ORGAO_LONGO: `O nome do órgão pode ter até ${TAMANHO_MAXIMO_LICITACAO.ORGAO} caracteres.`,
  LICITACAO_OBJETO_LONGO: `A descrição do objeto pode ter até ${TAMANHO_MAXIMO_LICITACAO.OBJETO} caracteres.`,
  LICITACAO_STATUS_INVALIDO: 'Status de licitação inválido.',
  LICITACAO_DATA_INVALIDA: 'Informe uma data de abertura válida.',
  LICITACAO_DUPLICADA: 'Você já cadastrou uma licitação com este número para este órgão.',
};
