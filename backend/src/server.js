import cors from 'cors';
import express from 'express';
import { AMBIENTE } from './config/ambiente.js';
import { STATUS } from './constantes/http.js';
import { CAMINHOS } from './constantes/rotas.js';
import { rotaNaoEncontrada, tratarErros } from './middleware/tratarErros.js';
import { rotasAuth } from './rotas/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get(CAMINHOS.SAUDE, (_req, res) => res.status(STATUS.OK).json({ status: 'ok' }));
app.use(CAMINHOS.AUTH, rotasAuth);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

app.listen(AMBIENTE.PORTA, () => {
  console.log(`API do Calcule Certo rodando em http://localhost:${AMBIENTE.PORTA}`);
});
