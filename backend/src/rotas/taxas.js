import { Router } from 'express';
import { CAMINHOS_RECURSO } from '../constantes/rotas.js';
import { taxaControlador } from '../controladores/taxaControlador.js';
import { autenticar } from '../middleware/autenticar.js';
import { validarId } from '../middleware/validarId.js';

export const rotasTaxas = Router();

rotasTaxas.use(autenticar);
rotasTaxas.param('id', validarId);

rotasTaxas.get(CAMINHOS_RECURSO.RAIZ, taxaControlador.listar);
rotasTaxas.post(CAMINHOS_RECURSO.RAIZ, taxaControlador.cadastrar);
rotasTaxas.put(CAMINHOS_RECURSO.POR_ID, taxaControlador.atualizar);
rotasTaxas.delete(CAMINHOS_RECURSO.POR_ID, taxaControlador.excluir);
