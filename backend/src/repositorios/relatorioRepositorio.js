import { consultar } from '../db.js';

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
};
