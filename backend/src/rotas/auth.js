import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { consultar } from '../db.js';
import { autenticar } from '../middleware/autenticar.js';

export const rotasAuth = Router();

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TAMANHO_MINIMO_SENHA = 8;

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    process.env.JWT_SEGREDO,
    { expiresIn: process.env.JWT_EXPIRACAO || '8h' },
  );
}

function semSenha({ id, nome, email, cnpj }) {
  return { id, nome, email, cnpj };
}

// POST /api/auth/cadastrar  -> Usuario.cadastrar() do diagrama de classes
rotasAuth.post('/cadastrar', async (req, res) => {
  const nome = String(req.body?.nome ?? '').trim();
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const senha = String(req.body?.senha ?? '');
  const cnpj = String(req.body?.cnpj ?? '').replace(/\D/g, '');

  if (nome.length < 3) {
    return res.status(400).json({ erro: 'Informe o nome completo.' });
  }
  if (!FORMATO_EMAIL.test(email)) {
    return res.status(400).json({ erro: 'Informe um e-mail valido.' });
  }
  if (senha.length < TAMANHO_MINIMO_SENHA) {
    return res.status(400).json({ erro: `A senha precisa ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.` });
  }
  if (cnpj && cnpj.length !== 14) {
    return res.status(400).json({ erro: 'O CNPJ deve ter 14 digitos.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const { rows } = await consultar(
      `INSERT INTO usuarios (nome, email, senha_hash, cnpj)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, cnpj`,
      [nome, email, senhaHash, cnpj || null],
    );
    const usuario = rows[0];
    return res.status(201).json({ usuario: semSenha(usuario), token: gerarToken(usuario) });
  } catch (erro) {
    if (erro.code === '23505') {
      return res.status(409).json({ erro: 'Ja existe uma conta com este e-mail.' });
    }
    console.error(erro);
    return res.status(500).json({ erro: 'Nao foi possivel concluir o cadastro.' });
  }
});

// POST /api/auth/login  -> Usuario.autenticar() do diagrama de classes
rotasAuth.post('/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const senha = String(req.body?.senha ?? '');

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha o e-mail e a senha.' });
  }

  try {
    const { rows } = await consultar(
      'SELECT id, nome, email, senha_hash, cnpj FROM usuarios WHERE email = $1',
      [email],
    );
    const usuario = rows[0];

    // Mensagem generica de proposito: nao revela se o e-mail existe no sistema.
    const senhaConfere = usuario && (await bcrypt.compare(senha, usuario.senha_hash));
    if (!senhaConfere) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    return res.json({ usuario: semSenha(usuario), token: gerarToken(usuario) });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Nao foi possivel entrar agora. Tente novamente.' });
  }
});

// GET /api/auth/eu -> devolve o usuario do token; usado para manter a sessao.
rotasAuth.get('/eu', autenticar, async (req, res) => {
  const { rows } = await consultar(
    'SELECT id, nome, email, cnpj FROM usuarios WHERE id = $1',
    [req.usuario.id],
  );
  if (rows.length === 0) {
    return res.status(404).json({ erro: 'Usuario nao encontrado.' });
  }
  return res.json({ usuario: rows[0] });
});
