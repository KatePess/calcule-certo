import { consultar } from '../db.js';
import { termoDeBusca } from '../utils/paginacao.js';

const COLUNAS = `
  l.id, l.numero, l.orgao, l.objeto, l.status, l.data_abertura,
  l.criado_em, l.atualizado_em,
  (SELECT COUNT(*)::int FROM calculos c WHERE c.licitacao_id = l.id) AS quantidade_calculos
`;

// Toda consulta filtra por usuario_id: ninguem enxerga licitacao de outro.
export const licitacaoRepositorio = {
  async listar({ usuarioId, status, busca, limite, deslocamento }) {
    const parametros = [usuarioId];
    const filtros = ['l.usuario_id = $1'];

    if (status) {
      parametros.push(status);
      filtros.push(`l.status = $${parametros.length}`);
    }
    if (busca) {
      parametros.push(termoDeBusca(busca));
      const n = parametros.length;
      filtros.push(`(l.numero ILIKE $${n} OR l.orgao ILIKE $${n} OR l.objeto ILIKE $${n})`);
    }
    const onde = filtros.join(' AND ');

    const total = await consultar(`SELECT COUNT(*)::int AS total FROM licitacoes l WHERE ${onde}`, parametros);
    const { rows } = await consultar(
      `SELECT ${COLUNAS}
         FROM licitacoes l
        WHERE ${onde}
        ORDER BY l.atualizado_em DESC, l.id DESC
        LIMIT $${parametros.length + 1} OFFSET $${parametros.length + 2}`,
      [...parametros, limite, deslocamento],
    );
    return { itens: rows, total: total.rows[0].total };
  },

  async buscarPorId(id, usuarioId) {
    const { rows } = await consultar(
      `SELECT ${COLUNAS} FROM licitacoes l WHERE l.id = $1 AND l.usuario_id = $2`,
      [id, usuarioId],
    );
    return rows[0] ?? null;
  },

  async inserir({ usuarioId, numero, orgao, objeto, status, dataAbertura }) {
    const { rows } = await consultar(
      `INSERT INTO licitacoes AS l (usuario_id, numero, orgao, objeto, status, data_abertura)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLUNAS}`,
      [usuarioId, numero, orgao, objeto, status, dataAbertura],
    );
    return rows[0];
  },

  async atualizar(id, usuarioId, { numero, orgao, objeto, status, dataAbertura }) {
    const { rows } = await consultar(
      `UPDATE licitacoes AS l
          SET numero = $3, orgao = $4, objeto = $5, status = $6, data_abertura = $7,
              atualizado_em = NOW()
        WHERE l.id = $1 AND l.usuario_id = $2
        RETURNING ${COLUNAS}`,
      [id, usuarioId, numero, orgao, objeto, status, dataAbertura],
    );
    return rows[0] ?? null;
  },

  async atualizarStatus(id, usuarioId, status) {
    const { rows } = await consultar(
      `UPDATE licitacoes AS l
          SET status = $3, atualizado_em = NOW()
        WHERE l.id = $1 AND l.usuario_id = $2
        RETURNING ${COLUNAS}`,
      [id, usuarioId, status],
    );
    return rows[0] ?? null;
  },

  async excluir(id, usuarioId) {
    const { rowCount } = await consultar(
      'DELETE FROM licitacoes WHERE id = $1 AND usuario_id = $2',
      [id, usuarioId],
    );
    return rowCount > 0;
  },

  // Alertas do painel: licitacoes ainda em aberto cuja data de abertura cai
  // entre "desde" e "ate" (datas AAAA-MM-DD), das mais proximas as mais distantes.
  async listarComAberturaEntre({ usuarioId, desde, ate, statusIgnorados, limite }) {
    const { rows } = await consultar(
      `SELECT ${COLUNAS}
         FROM licitacoes l
        WHERE l.usuario_id = $1
          AND l.data_abertura BETWEEN $2 AND $3
          AND l.status <> ALL($4)
        ORDER BY l.data_abertura, l.id
        LIMIT $5`,
      [usuarioId, desde, ate, statusIgnorados, limite],
    );
    return rows;
  },

  // Registra atividade na licitacao (ex.: novo calculo), para ela subir nas
  // listas ordenadas pela mais recente.
  async registrarAtividade(id, cliente) {
    await consultar('UPDATE licitacoes SET atualizado_em = NOW() WHERE id = $1', [id], cliente);
  },
};
