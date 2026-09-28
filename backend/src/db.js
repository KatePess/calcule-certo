import pg from 'pg';
import { AMBIENTE } from './config/ambiente.js';

// Colunas DATE chegam como texto 'AAAA-MM-DD'. Sem isso o driver cria um
// Date na meia-noite local, e a conversao para JSON pode trocar o dia.
const TIPO_DATE = 1082;
pg.types.setTypeParser(TIPO_DATE, (valor) => valor);

// Pool de conexoes com o PostgreSQL. O pool reaproveita conexoes abertas,
// evitando o custo de abrir uma nova a cada requisicao.
export const pool = new pg.Pool(AMBIENTE.BANCO);

// "cliente" permite que a consulta rode dentro de uma transacao.
export function consultar(sql, parametros = [], cliente = pool) {
  return cliente.query(sql, parametros);
}

// Executa varias consultas como uma unidade: ou todas gravam, ou nenhuma.
export async function transacao(trabalho) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');
    const resultado = await trabalho(cliente);
    await cliente.query('COMMIT');
    return resultado;
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}
