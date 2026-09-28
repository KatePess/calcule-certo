import { criarApp } from './app.js';
import { AMBIENTE, conferirAmbiente } from './config/ambiente.js';

const { erros, avisos } = conferirAmbiente();
avisos.forEach((aviso) => console.warn(`Aviso: ${aviso}`));
if (erros.length > 0) {
  erros.forEach((erro) => console.error(`Erro de configuração: ${erro}`));
  process.exit(1);
}

criarApp().listen(AMBIENTE.PORTA, () => {
  console.log(`API do Calcule Certo rodando em http://localhost:${AMBIENTE.PORTA}`);
});
