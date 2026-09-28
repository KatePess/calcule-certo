import 'dotenv/config';

// Leitura centralizada do .env. Nenhum outro arquivo acessa process.env
// diretamente, entao a origem de cada configuracao fica evidente.
export const AMBIENTE = {
  PORTA: Number(process.env.PORTA || 3001),

  BANCO: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'calcule',
    password: process.env.DB_PASSWORD || 'calcule',
    database: process.env.DB_NAME || 'calcule_certo',
  },

  JWT: {
    segredo: process.env.JWT_SEGREDO,
    expiracao: process.env.JWT_EXPIRACAO || '8h',
  },

  // Fuso usado nas datas impressas nos relatorios (Rio Branco, UTC-5).
  FUSO_HORARIO: process.env.FUSO_HORARIO || 'America/Rio_Branco',
};
