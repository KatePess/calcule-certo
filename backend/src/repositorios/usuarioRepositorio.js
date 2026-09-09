import { consultar } from '../db.js';

// Unica camada que conhece SQL. Se o banco mudar, so este arquivo muda.
export const usuarioRepositorio = {
  async criarTabela() {
    await consultar(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id          SERIAL PRIMARY KEY,
        nome        VARCHAR(120)  NOT NULL,
        email       VARCHAR(160)  NOT NULL UNIQUE,
        senha_hash  VARCHAR(255)  NOT NULL,
        cnpj        VARCHAR(18),
        criado_em   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      )
    `);
  },

  async inserir({ nome, email, senhaHash, cnpj }) {
    const { rows } = await consultar(
      `INSERT INTO usuarios (nome, email, senha_hash, cnpj)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, cnpj`,
      [nome, email, senhaHash, cnpj || null],
    );
    return rows[0];
  },

  async buscarPorEmail(email) {
    const { rows } = await consultar(
      'SELECT id, nome, email, senha_hash, cnpj FROM usuarios WHERE email = $1',
      [email],
    );
    return rows[0] ?? null;
  },

  async buscarPorId(id) {
    const { rows } = await consultar(
      'SELECT id, nome, email, cnpj FROM usuarios WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  },
};
