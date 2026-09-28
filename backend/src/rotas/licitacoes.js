import { Router } from 'express';
import { CAMINHOS_RECURSO } from '../constantes/rotas.js';
import { licitacaoControlador } from '../controladores/licitacaoControlador.js';
import { autenticar } from '../middleware/autenticar.js';
import { validarId } from '../middleware/validarId.js';

export const rotasLicitacoes = Router();

// Todas as rotas de licitacao exigem login.
rotasLicitacoes.use(autenticar);
rotasLicitacoes.param('id', validarId);

rotasLicitacoes.get(CAMINHOS_RECURSO.RAIZ, licitacaoControlador.listar);
rotasLicitacoes.post(CAMINHOS_RECURSO.RAIZ, licitacaoControlador.cadastrar);
rotasLicitacoes.get(CAMINHOS_RECURSO.POR_ID, licitacaoControlador.obter);
rotasLicitacoes.put(CAMINHOS_RECURSO.POR_ID, licitacaoControlador.atualizar);
rotasLicitacoes.patch(CAMINHOS_RECURSO.STATUS, licitacaoControlador.atualizarStatus);
rotasLicitacoes.delete(CAMINHOS_RECURSO.POR_ID, licitacaoControlador.excluir);
