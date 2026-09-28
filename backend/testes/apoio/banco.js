// Prepara o banco de teste: cria se nao existir, aplica as migracoes e
// oferece uma funcao para zerar os dados entre um teste e outro.
import pg from 'pg';
import { AMBIENTE } from '../../src/config/ambiente.js';
import { consultar, pool } from '../../src/db.js';
import { aplicarMigracoes } from '../../src/scripts/migrar.js';

const CODIGO_PG_BANCO_JA_EXISTE = '42P04';

// Trava de seguranca: limparTabelas() apaga tudo. Nunca pode rodar no banco
// de desenvolvimento, entao os testes so aceitam banco terminado em _teste.
function exigirBancoDeTeste() {
  const nome = AMBIENTE.BANCO.database;
  if (!nome.endsWith('_teste')) {
    throw new Error(`Os testes só rodam em banco terminado em "_teste" (atual: "${nome}"). Use "npm test".`);
  }
}

export async function prepararBancoDeTeste() {
  exigirBancoDeTeste();

  const administrador = new pg.Client({ ...AMBIENTE.BANCO, database: 'postgres' });
  await administrador.connect();
  try {
    await administrador.query(`CREATE DATABASE ${AMBIENTE.BANCO.database}`);
  } catch (erro) {
    if (erro.code !== CODIGO_PG_BANCO_JA_EXISTE) throw erro;
  } finally {
    await administrador.end();
  }

  await aplicarMigracoes({ silencioso: true });
}

export async function limparTabelas() {
  exigirBancoDeTeste();
  // CASCADE limpa tambem as tabelas que dependem de usuarios.
  await consultar('TRUNCATE usuarios RESTART IDENTITY CASCADE');
}

export async function encerrarBanco() {
  await pool.end();
}
