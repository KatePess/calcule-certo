import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

// Traduz as rotas de autenticacao da API em funcoes de dominio.
export const autenticacaoServico = {
  login(email, senha) {
    return requisitar(ENDPOINTS.LOGIN, {
      metodo: METODOS.POST,
      corpo: { email, senha },
    });
  },

  cadastrar(dadosUsuario) {
    return requisitar(ENDPOINTS.CADASTRAR, {
      metodo: METODOS.POST,
      corpo: dadosUsuario,
    });
  },

  usuarioLogado() {
    return requisitar(ENDPOINTS.USUARIO_LOGADO, { autenticado: true });
  },

  atualizarPerfil(dados) {
    return requisitar(ENDPOINTS.PERFIL, { metodo: METODOS.PUT, corpo: dados, autenticado: true });
  },

  trocarSenha(senhaAtual, novaSenha) {
    return requisitar(ENDPOINTS.SENHA, { metodo: METODOS.PUT, corpo: { senhaAtual, novaSenha }, autenticado: true });
  },

  solicitarRecuperacao(email) {
    return requisitar(ENDPOINTS.ESQUECI_SENHA, { metodo: METODOS.POST, corpo: { email } });
  },

  redefinirSenha(token, novaSenha) {
    return requisitar(ENDPOINTS.REDEFINIR_SENHA, { metodo: METODOS.POST, corpo: { token, novaSenha } });
  },
};
