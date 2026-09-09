import { PREFIXO_TOKEN, STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { verificarToken } from '../utils/token.js';

// Protege rotas que so podem ser acessadas por usuario autenticado.
// Espera o cabecalho:  Authorization: Bearer <token>
export function autenticar(req, res, proximo) {
  const [tipo, token] = (req.headers.authorization || '').split(' ');

  if (tipo !== PREFIXO_TOKEN || !token) {
    return res.status(STATUS.NAO_AUTORIZADO).json({ erro: ERROS.TOKEN_AUSENTE });
  }

  try {
    req.usuario = verificarToken(token);
    return proximo();
  } catch {
    return res.status(STATUS.NAO_AUTORIZADO).json({ erro: ERROS.TOKEN_INVALIDO });
  }
}
