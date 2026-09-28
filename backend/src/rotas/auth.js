import { Router } from 'express';
import { CAMINHOS_AUTH } from '../constantes/rotas.js';
import { autenticacaoControlador } from '../controladores/autenticacaoControlador.js';
import { recuperacaoSenhaControlador } from '../controladores/recuperacaoSenhaControlador.js';
import { autenticar } from '../middleware/autenticar.js';

// Apenas o mapa de caminhos: cada rota aponta para um metodo do controlador.
// Aqui a protecao e rota a rota, porque login, cadastro e recuperacao de
// senha sao publicos.
export const rotasAuth = Router();

rotasAuth.post(CAMINHOS_AUTH.CADASTRAR, autenticacaoControlador.cadastrar);
rotasAuth.post(CAMINHOS_AUTH.LOGIN, autenticacaoControlador.login);
rotasAuth.get(CAMINHOS_AUTH.USUARIO_LOGADO, autenticar, autenticacaoControlador.usuarioLogado);
rotasAuth.put(CAMINHOS_AUTH.PERFIL, autenticar, autenticacaoControlador.atualizarPerfil);
rotasAuth.put(CAMINHOS_AUTH.SENHA, autenticar, autenticacaoControlador.trocarSenha);
rotasAuth.post(CAMINHOS_AUTH.ESQUECI_SENHA, recuperacaoSenhaControlador.solicitar);
rotasAuth.post(CAMINHOS_AUTH.REDEFINIR_SENHA, recuperacaoSenhaControlador.redefinir);
