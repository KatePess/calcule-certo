import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';

export function rotaNaoEncontrada(_req, res) {
  res.status(STATUS.NAO_ENCONTRADO).json({ erro: ERROS.ROTA_NAO_ENCONTRADA });
}

// Ponto unico de tratamento de erro. Os controladores repassam a falha para
// ca com next(erro), em vez de montar a resposta cada um do seu jeito.
export function tratarErros(erro, _req, res, _proximo) {
  const status = erro.status || STATUS.ERRO_INTERNO;
  if (status === STATUS.ERRO_INTERNO) {
    console.error(erro);
  }
  res.status(status).json({ erro: erro.message || ERROS.FALHA_LOGIN });
}
