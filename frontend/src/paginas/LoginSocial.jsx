import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEXTOS_LOGIN_SOCIAL } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { useSessaoStore } from '../stores/index.jsx';

// A API devolve o login com Google/LinkedIn para esta tela com o resultado
// depois do "#": #token=... quando deu certo ou #erro=... quando nao.
export default function LoginSocial() {
  const sessao = useSessaoStore();
  const navegar = useNavigate();
  // Em desenvolvimento o React roda o efeito duas vezes; o token so pode ser
  // usado uma.
  const jaProcessou = useRef(false);

  useEffect(() => {
    if (jaProcessou.current) return;
    jaProcessou.current = true;

    const resultado = new URLSearchParams(window.location.hash.slice(1));
    // Tira o token da barra de endereco e do historico.
    window.history.replaceState(null, '', window.location.pathname);

    const token = resultado.get('token');
    const voltarAoLogin = (erro) => navegar(ROTAS.LOGIN, { replace: true, state: { erro } });

    if (!token) {
      voltarAoLogin(resultado.get('erro') || TEXTOS_LOGIN_SOCIAL.FALHA);
      return;
    }
    sessao
      .entrarComToken(token)
      .then(() => navegar(ROTAS.HOME, { replace: true }))
      .catch(() => voltarAoLogin(TEXTOS_LOGIN_SOCIAL.FALHA));
  }, [sessao, navegar]);

  return <div className="tela-carregando">{TEXTOS_LOGIN_SOCIAL.CONCLUINDO}</div>;
}
