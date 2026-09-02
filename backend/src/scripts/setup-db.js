// Cria a tabela de usuarios e insere um usuario de demonstracao.
// Rodar com: npm run db:setup
import bcrypt from 'bcryptjs';
import { consultar, pool } from '../db.js';

const EMAIL_DEMO = 'kate@calculecerto.com';
const SENHA_DEMO = 'calcule123';

async function main() {
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
  console.log('Tabela "usuarios" pronta.');

  const { rows } = await consultar('SELECT id FROM usuarios WHERE email = $1', [EMAIL_DEMO]);
  if (rows.length === 0) {
    const hash = await bcrypt.hash(SENHA_DEMO, 10);
    await consultar(
      'INSERT INTO usuarios (nome, email, senha_hash, cnpj) VALUES ($1, $2, $3, $4)',
      ['Kate Pessoa dos Santos', EMAIL_DEMO, hash, '12345678000199'],
    );
    console.log(`Usuario de demonstracao criado -> ${EMAIL_DEMO} / ${SENHA_DEMO}`);
  } else {
    console.log('Usuario de demonstracao ja existia, nada a fazer.');
  }
}

main()
  .catch((erro) => {
    console.error('Falha ao preparar o banco:', erro.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
