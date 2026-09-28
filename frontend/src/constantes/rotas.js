// Caminhos de navegacao da aplicacao. Centralizados para que uma mudanca de
// endereco nao precise ser cacada em varios arquivos.
export const ROTAS = {
  RAIZ: '/',
  LOGIN: '/login',
  CADASTRO: '/cadastro',
  ESQUECI_SENHA: '/esqueci-senha',
  // O link do e-mail aponta para ca: precisa bater com CAMINHO_TELA_REDEFINIR
  // em backend/src/constantes/recuperacaoSenha.js.
  REDEFINIR_SENHA: '/redefinir-senha',
  HOME: '/home',
  ORCAMENTO: '/orcamento',
  RELATORIOS: '/relatorios',
  PERFIL: '/perfil',
  RESUMO: '/resumo',
};
