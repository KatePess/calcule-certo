import jwt from 'jsonwebtoken';

// Protege rotas que so podem ser acessadas por usuario autenticado.
// Espera o cabecalho:  Authorization: Bearer <token>
export function autenticar(req, res, proximo) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token de acesso nao enviado.' });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SEGREDO);
    return proximo();
  } catch {
    return res.status(401).json({ erro: 'Sessao expirada ou token invalido.' });
  }
}
