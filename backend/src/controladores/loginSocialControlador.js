import { AMBIENTE } from '../config/ambiente.js';
import { CAMINHO_TELA_LOGIN_SOCIAL } from '../constantes/loginSocial.js';
import { ERROS } from '../constantes/mensagens.js';
import { loginSocialServico } from '../servicos/loginSocialServico.js';

// Aqui as respostas sao redirecionamentos, nao JSON: quem chega e o navegador,
// vindo do botao do front ou da tela do Google/LinkedIn. O resultado vai para
// a tela /login/social do front depois do "#", que nao e enviado a servidores
// nem fica nos logs.
function voltarParaOFront(res, dados) {
  res.redirect(`${AMBIENTE.URL_FRONT}${CAMINHO_TELA_LOGIN_SOCIAL}#${new URLSearchParams(dados)}`);
}

function mensagemDoErro(erro) {
  return erro.status ? erro.message : ERROS.ERRO_INESPERADO;
}

export const loginSocialControlador = {
  iniciar(req, res) {
    try {
      res.redirect(loginSocialServico.urlAutorizacao(req.params.provedor));
    } catch (erro) {
      voltarParaOFront(res, { erro: mensagemDoErro(erro) });
    }
  },

  async retorno(req, res) {
    try {
      const { token } = await loginSocialServico.concluir(req.params.provedor, req.query);
      voltarParaOFront(res, { token });
    } catch (erro) {
      if (!erro.status) console.error(erro);
      voltarParaOFront(res, { erro: mensagemDoErro(erro) });
    }
  },
};
