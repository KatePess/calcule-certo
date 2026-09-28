import { consultar } from '../db.js';

// Unica camada que conhece SQL. Se o banco mudar, so este arquivo muda.
// A criacao da tabela fica em migracoes/001_usuarios.sql.
export const usuarioRepositorio = {
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
