import { consultar } from '../db.js';

const COLUNAS = `
  r.id, r.gerado_em, r.baixado_em, c.id AS calculo_id, c.resultado_final,
  l.id AS licitacao_id, l.numero AS licitacao_numero, l.orgao AS licitacao_orgao
`;

// O dono do relatorio e o dono do calculo: toda consulta passa por calculos.
const ORIGEM = `
  FROM relatorios r
  JOIN calculos c ON c.id = r.calculo_id
  JOIN licitacoes l ON l.id = c.licitacao_id
`;

export const relatorioRepositorio = {
  // Chamado na mesma transacao que grava o calculo.
  async inserir(calculoId, cliente) {
    const { rows } = await consultar(
      'INSERT INTO relatorios (calculo_id) VALUES ($1) RETURNING id, gerado_em',
      [calculoId],
      cliente,
    );
    return rows[0];
  },

  async listar({ usuarioId, de, ate, licitacaoId, limite, deslocamento }) {
    const parametros = [usuarioId];
    const filtros = ['c.usuario_id = $1'];

    if (de) {
      parametros.push(de);
      filtros.push(`r.gerado_em >= $${parametros.length}`);
    }
    if (ate) {
      parametros.push(ate);
      filtros.push(`r.gerado_em <= $${parametros.length}`);
    }
    if (licitacaoId) {
      parametros.push(licitacaoId);
      filtros.push(`l.id = $${parametros.length}`);
    }
    const onde = filtros.join(' AND ');

    const total = await consultar(`SELECT COUNT(*)::int AS total ${ORIGEM} WHERE ${onde}`, parametros);
    const { rows } = await consultar(
      `SELECT ${COLUNAS} ${ORIGEM}
        WHERE ${onde}
        ORDER BY r.gerado_em DESC, r.id DESC
        LIMIT $${parametros.length + 1} OFFSET $${parametros.length + 2}`,
      [...parametros, limite, deslocamento],
    );
    return { itens: rows, total: total.rows[0].total };
  },

  async buscarPorId(id, usuarioId) {
    const { rows } = await consultar(`SELECT ${COLUNAS} ${ORIGEM} WHERE r.id = $1 AND c.usuario_id = $2`, [id, usuarioId]);
    return rows[0] ?? null;
  },

  // Guarda so o primeiro download: e ele que faz o botao virar "Feito".
  async marcarBaixado(id) {
    await consultar('UPDATE relatorios SET baixado_em = COALESCE(baixado_em, NOW()) WHERE id = $1', [id]);
  },
};
