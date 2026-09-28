import { consultar } from '../db.js';

// Links de "Esqueci minha senha" (migracoes/006_tokens_recuperacao_senha.sql).
export const tokenRecuperacaoRepositorio = {
  // Quantos segundos se passaram desde o ultimo pedido da conta (null se nenhum).
  async segundosDesdeUltimoPedido(usuarioId) {
    const { rows } = await consultar(
      `SELECT EXTRACT(EPOCH FROM NOW() - MAX(criado_em))::int AS segundos
         FROM tokens_recuperacao_senha
        WHERE usuario_id = $1`,
      [usuarioId],
    );
    return rows[0].segundos;
  },

  // O pedido novo apaga o link anterior: so o ultimo e-mail funciona.
  async substituir(usuarioId, tokenHash, validadeMinutos, cliente) {
    await consultar('DELETE FROM tokens_recuperacao_senha WHERE usuario_id = $1', [usuarioId], cliente);
    await consultar(
      `INSERT INTO tokens_recuperacao_senha (usuario_id, token_hash, expira_em)
       VALUES ($1, $2, NOW() + make_interval(mins => $3))`,
      [usuarioId, tokenHash, validadeMinutos],
      cliente,
    );
  },

  // Confere e gasta o link numa unica instrucao: se dois pedidos chegarem
  // juntos com o mesmo link, so um deles consegue usa-lo.
  async consumir(tokenHash, cliente) {
    const { rows } = await consultar(
      `UPDATE tokens_recuperacao_senha
          SET usado_em = NOW()
        WHERE token_hash = $1 AND usado_em IS NULL AND expira_em > NOW()
        RETURNING usuario_id`,
      [tokenHash],
      cliente,
    );
    return rows[0]?.usuario_id ?? null;
  },
};
