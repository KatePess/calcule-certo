import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { rotasAuth } from './rotas/auth.js';

const app = express();
const PORTA = Number(process.env.PORTA || 3001);

app.use(cors());
app.use(express.json());

app.get('/api/saude', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', rotasAuth);

app.use((_req, res) => res.status(404).json({ erro: 'Rota nao encontrada.' }));

app.listen(PORTA, () => {
  console.log(`API do Calcule Certo rodando em http://localhost:${PORTA}`);
});
