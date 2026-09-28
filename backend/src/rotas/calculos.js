import { Router } from 'express';
import { CAMINHOS_CALCULO, CAMINHOS_RECURSO } from '../constantes/rotas.js';
import { calculoControlador } from '../controladores/calculoControlador.js';
import { autenticar } from '../middleware/autenticar.js';
import { validarId } from '../middleware/validarId.js';

export const rotasCalculos = Router();

rotasCalculos.use(autenticar);
rotasCalculos.param('id', validarId);

rotasCalculos.post(CAMINHOS_CALCULO.SIMULAR, calculoControlador.simular);
rotasCalculos.post(CAMINHOS_RECURSO.RAIZ, calculoControlador.salvar);
rotasCalculos.get(CAMINHOS_RECURSO.POR_ID, calculoControlador.obter);
