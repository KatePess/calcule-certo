import cors from 'cors';
import express from 'express';
import { STATUS } from './constantes/http.js';
import { CAMINHOS } from './constantes/rotas.js';
import { rotaNaoEncontrada, tratarErros } from './middleware/tratarErros.js';
import { rotasAuth } from './rotas/auth.js';
import { rotasCalculos } from './rotas/calculos.js';
import { rotasLicitacoes } from './rotas/licitacoes.js';

// Monta a aplicacao sem colocar o servidor no ar. Separar isso do listen()
// permite que os testes subam a API numa porta livre, sem conflito.
export function criarApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get(CAMINHOS.SAUDE, (_req, res) => res.status(STATUS.OK).json({ status: 'ok' }));
  app.use(CAMINHOS.AUTH, rotasAuth);
  app.use(CAMINHOS.LICITACOES, rotasLicitacoes);
  app.use(CAMINHOS.CALCULOS, rotasCalculos);

  app.use(rotaNaoEncontrada);
  app.use(tratarErros);

  return app;
}
