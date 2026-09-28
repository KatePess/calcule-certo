// Aplica, em ordem, os arquivos .sql de src/migracoes que ainda nao rodaram
// neste banco. Cada um roda numa transacao e fica registrado na tabela
// "migracoes", para nunca ser aplicado duas vezes.
// Rodar com: npm run migrar
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { consultar, pool, transacao } from '../db.js';

const PASTA_MIGRACOES = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migracoes');

export async function aplicarMigracoes({ silencioso = false } = {}) {
  await consultar(`
    CREATE TABLE IF NOT EXISTS migracoes (
      nome         VARCHAR(120) PRIMARY KEY,
      aplicada_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);

  const { rows } = await consultar('SELECT nome FROM migracoes');
  const jaAplicadas = new Set(rows.map((linha) => linha.nome));

  const arquivos = (await readdir(PASTA_MIGRACOES)).filter((nome) => nome.endsWith('.sql')).sort();
  const aplicadasAgora = [];

  for (const arquivo of arquivos) {
    if (jaAplicadas.has(arquivo)) continue;

    const sql = await readFile(path.join(PASTA_MIGRACOES, arquivo), 'utf8');
    await transacao(async (cliente) => {
      await cliente.query(sql);
      await cliente.query('INSERT INTO migracoes (nome) VALUES ($1)', [arquivo]);
    });
    aplicadasAgora.push(arquivo);
    if (!silencioso) console.log(`Migracao aplicada: ${arquivo}`);
  }

  if (!silencioso && aplicadasAgora.length === 0) {
    console.log('O banco ja esta atualizado.');
  }
  return aplicadasAgora;
}

// So executa sozinho quando chamado pela linha de comando, e nao quando
// importado por outro arquivo (setup-db e testes).
const executadoDireto = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executadoDireto) {
  aplicarMigracoes()
    .catch((erro) => {
      console.error('Falha ao aplicar migracoes:', erro.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}
