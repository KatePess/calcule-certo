import { QUANTIDADE_DIGITOS_CNPJ, TAMANHO_MINIMO_SENHA } from './validacao.js';

export const ERROS = {
  NOME_INVALIDO: 'Informe o nome completo.',
  EMAIL_INVALIDO: 'Informe um e-mail valido.',
  SENHA_CURTA: `A senha precisa ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  CNPJ_INVALIDO: `O CNPJ deve ter ${QUANTIDADE_DIGITOS_CNPJ} digitos.`,
  CAMPOS_LOGIN_VAZIOS: 'Preencha o e-mail e a senha.',
  EMAIL_JA_CADASTRADO: 'Ja existe uma conta com este e-mail.',
  // Mensagem generica de proposito: nao revela se o e-mail existe no sistema.
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
  FALHA_CADASTRO: 'Nao foi possivel concluir o cadastro.',
  FALHA_LOGIN: 'Nao foi possivel entrar agora. Tente novamente.',
  USUARIO_NAO_ENCONTRADO: 'Usuario nao encontrado.',
  TOKEN_AUSENTE: 'Token de acesso nao enviado.',
  TOKEN_INVALIDO: 'Sessao expirada ou token invalido.',
  ROTA_NAO_ENCONTRADA: 'Rota nao encontrada.',
};
