import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';

export function rotaNaoEncontrada(_req, res) {
  res.status(STATUS.NAO_ENCONTRADO).json({ erro: ERROS.ROTA_NAO_ENCONTRADA });
}

// Ponto unico de tratamento de erro. Os controladores repassam a falha para
// ca com next(erro), em vez de montar a resposta cada um do seu jeito.
export function tratarErros(erro, _req, res, _proximo) {
  if (erro instanceof ErroDeAplicacao) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  // Corpo da requisicao que nao e JSON valido (erro do express.json()).
  if (erro.type === 'entity.parse.failed') {
    return res.status(STATUS.REQUISICAO_INVALIDA).json({ erro: ERROS.JSON_INVALIDO });
  }

  // Qualquer outro erro e inesperado: registra no log, mas nao expoe os
  // detalhes internos (mensagens do banco, por exemplo) ao usuario.
  console.error(erro);
  return res.status(STATUS.ERRO_INTERNO).json({ erro: ERROS.ERRO_INESPERADO });
}
