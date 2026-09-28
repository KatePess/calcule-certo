import { LISTA_TIPOS_TAXA } from '../constantes/taxa.js';
import { consultar } from '../db.js';

const COLUNAS = 'id, nome, percentual, tipo, criado_em';

export const taxaRepositorio = {
  // Agrupa por tipo na mesma ordem da tela de calculo (plataforma, comissao, adicional).
  async listar(usuarioId) {
    const { rows } = await consultar(
      `SELECT ${COLUNAS} FROM taxas_customizadas
        WHERE usuario_id = $1
        ORDER BY array_position($2::text[], tipo), nome`,
      [usuarioId, LISTA_TIPOS_TAXA],
    );
    return rows;
  },

  async contar(usuarioId) {
    const { rows } = await consultar('SELECT COUNT(*)::int AS total FROM taxas_customizadas WHERE usuario_id = $1', [usuarioId]);
    return rows[0].total;
  },

  async inserir({ usuarioId, nome, percentual, tipo }) {
    const { rows } = await consultar(
      `INSERT INTO taxas_customizadas (usuario_id, nome, percentual, tipo)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUNAS}`,
      [usuarioId, nome, percentual, tipo],
    );
    return rows[0];
  },

  async atualizar(id, usuarioId, { nome, percentual, tipo }) {
    const { rows } = await consultar(
      `UPDATE taxas_customizadas SET nome = $3, percentual = $4, tipo = $5
        WHERE id = $1 AND usuario_id = $2
        RETURNING ${COLUNAS}`,
      [id, usuarioId, nome, percentual, tipo],
    );
    return rows[0] ?? null;
  },

  async excluir(id, usuarioId) {
    const { rowCount } = await consultar('DELETE FROM taxas_customizadas WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
    return rowCount > 0;
  },
};
