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

  async buscarHashPorId(id) {
    const { rows } = await consultar('SELECT senha_hash FROM usuarios WHERE id = $1', [id]);
    return rows[0]?.senha_hash ?? null;
  },

  async atualizarPerfil(id, { nome, cnpj }) {
    const { rows } = await consultar(
      'UPDATE usuarios SET nome = $2, cnpj = $3 WHERE id = $1 RETURNING id, nome, email, cnpj',
      [id, nome, cnpj || null],
    );
    return rows[0] ?? null;
  },

  async atualizarNome(id, nome) {
    const { rows } = await consultar(
      'UPDATE usuarios SET nome = $2 WHERE id = $1 RETURNING id, nome, email, cnpj',
      [id, nome],
    );
    return rows[0] ?? null;
  },

  // O CNPJ e da empresa; ele e editado em "Dados da empresa".
  async atualizarCnpj(id, cnpj, cliente) {
    await consultar('UPDATE usuarios SET cnpj = $2 WHERE id = $1', [id, cnpj || null], cliente);
  },

  async atualizarSenha(id, senhaHash, cliente) {
    await consultar('UPDATE usuarios SET senha_hash = $2 WHERE id = $1', [id, senhaHash], cliente);
  },

  async buscarPorId(id) {
    const { rows } = await consultar(
      'SELECT id, nome, email, cnpj FROM usuarios WHERE id = $1',
      [id],
    );
    return rows[0] ?? null;
  },
};
