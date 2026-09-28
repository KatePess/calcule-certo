import { Router } from 'express';
import { CAMINHOS_RECURSO, CAMINHOS_RELATORIO } from '../constantes/rotas.js';
import { relatorioControlador } from '../controladores/relatorioControlador.js';
import { autenticar } from '../middleware/autenticar.js';
import { validarId } from '../middleware/validarId.js';

export const rotasRelatorios = Router();

rotasRelatorios.use(autenticar);
rotasRelatorios.param('id', validarId);

rotasRelatorios.get(CAMINHOS_RECURSO.RAIZ, relatorioControlador.listar);
rotasRelatorios.get(CAMINHOS_RELATORIO.PDF, relatorioControlador.baixar);
rotasRelatorios.delete(CAMINHOS_RECURSO.POR_ID, relatorioControlador.excluir);
