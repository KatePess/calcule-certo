import { Router } from 'express';
import { CAMINHOS_RECURSO } from '../constantes/rotas.js';
import { empresaControlador } from '../controladores/empresaControlador.js';
import { autenticar } from '../middleware/autenticar.js';

// Uma empresa por conta: nao ha id no caminho, e sempre a de quem esta logado.
export const rotasEmpresa = Router();

rotasEmpresa.use(autenticar);

rotasEmpresa.get(CAMINHOS_RECURSO.RAIZ, empresaControlador.obter);
rotasEmpresa.put(CAMINHOS_RECURSO.RAIZ, empresaControlador.salvar);
