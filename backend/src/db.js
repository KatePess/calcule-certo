import 'dotenv/config';
import pg from 'pg';

// Pool de conexoes com o PostgreSQL. O pool reaproveita conexoes abertas,
// evitando o custo de abrir uma nova a cada requisicao.
export const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'calcule',
  password: process.env.DB_PASSWORD || 'calcule',
  database: process.env.DB_NAME || 'calcule_certo',
});

export function consultar(sql, parametros = []) {
  return pool.query(sql, parametros);
}
