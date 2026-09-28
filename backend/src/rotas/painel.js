import { Router } from 'express';
import { CAMINHOS_RECURSO } from '../constantes/rotas.js';
import { painelControlador } from '../controladores/painelControlador.js';
import { autenticar } from '../middleware/autenticar.js';

export const rotasPainel = Router();

rotasPainel.use(autenticar);
rotasPainel.get(CAMINHOS_RECURSO.RAIZ, painelControlador.obter);
