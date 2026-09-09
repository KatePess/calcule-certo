import pg from 'pg';
import { AMBIENTE } from './config/ambiente.js';

// Pool de conexoes com o PostgreSQL. O pool reaproveita conexoes abertas,
// evitando o custo de abrir uma nova a cada requisicao.
export const pool = new pg.Pool(AMBIENTE.BANCO);

export function consultar(sql, parametros = []) {
  return pool.query(sql, parametros);
}
