import { Router } from 'express';
import { CAMINHOS_AUTH } from '../constantes/rotas.js';
import { autenticacaoControlador } from '../controladores/autenticacaoControlador.js';
import { autenticar } from '../middleware/autenticar.js';

// Apenas o mapa de caminhos: cada rota aponta para um metodo do controlador.
export const rotasAuth = Router();

rotasAuth.post(CAMINHOS_AUTH.CADASTRAR, autenticacaoControlador.cadastrar);
rotasAuth.post(CAMINHOS_AUTH.LOGIN, autenticacaoControlador.login);
rotasAuth.get(CAMINHOS_AUTH.USUARIO_LOGADO, autenticar, autenticacaoControlador.usuarioLogado);
