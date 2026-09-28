import { criarApp } from './app.js';
import { AMBIENTE } from './config/ambiente.js';

criarApp().listen(AMBIENTE.PORTA, () => {
  console.log(`API do Calcule Certo rodando em http://localhost:${AMBIENTE.PORTA}`);
});
