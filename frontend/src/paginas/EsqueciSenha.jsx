import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconePessoa } from '../componentes/Icones.jsx';
import { TEXTOS_ESQUECI_SENHA, VALIDACAO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { VALIDADE_LINK_RECUPERACAO_MINUTOS } from '../constantes/validacao.js';
import { useSessaoStore } from '../stores/index.jsx';
import { ehEmailValido } from '../utils/validadores.js';
import '../estilos/auth.css';

// "Esqueci minha senha": pede o e-mail e manda o link de redefinicao.
// A resposta e sempre a mesma, exista ou nao a conta.
export default observer(function EsqueciSenha() {
  const sessao = useSessaoStore();
  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email ?? '');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviadoPara, setEnviadoPara] = useState('');

  async function aoEnviar(evento) {
    evento.preventDefault();
    if (!ehEmailValido(email)) {
      setErro(VALIDACAO.EMAIL);
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await sessao.solicitarRecuperacao(email.trim());
      setEnviadoPara(email.trim());
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="auth-fundo">
      <main className="auth-cartao">
        <section className="auth-painel">
          <div className="auth-painel__texto">
            <h1 className="auth-painel__titulo">{TEXTOS_ESQUECI_SENHA.PAINEL_TITULO}</h1>
            <p className="auth-painel__legenda">{TEXTOS_ESQUECI_SENHA.PAINEL_LEGENDA}</p>
          </div>
        </section>

        <section className="auth-lado">
          {enviadoPara ? (
            <>
              <h2 className="auth-titulo">{TEXTOS_ESQUECI_SENHA.ENVIADO_TITULO}</h2>
              <p className="aviso-sucesso" role="status">
                {TEXTOS_ESQUECI_SENHA.enviado(enviadoPara, VALIDADE_LINK_RECUPERACAO_MINUTOS)}
              </p>
              <p className="auth-legenda">{TEXTOS_ESQUECI_SENHA.ENVIADO_DICA}</p>
              <Link to={ROTAS.LOGIN} className="auth-botao">
                {TEXTOS_ESQUECI_SENHA.VOLTAR}
              </Link>
              <p className="auth-rodape">
                <button type="button" className="auth-link" onClick={() => setEnviadoPara('')}>
                  {TEXTOS_ESQUECI_SENHA.OUTRO_EMAIL}
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-titulo">{TEXTOS_ESQUECI_SENHA.TITULO}</h2>
              <p className="auth-legenda">{TEXTOS_ESQUECI_SENHA.LEGENDA}</p>

              <form onSubmit={aoEnviar} noValidate>
                {erro && (
                  <p className="aviso-erro" role="alert">
                    {erro}
                  </p>
                )}

                <div className="campo">
                  <label className="campo__rotulo" htmlFor="email-recuperacao">
                    E-mail
                  </label>
                  <div className="campo__caixa">
                    <input
                      id="email-recuperacao"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail"
                      autoComplete="email"
                      required
                      autoFocus
                    />
                    <span className="campo__icone" aria-hidden="true">
                      <IconePessoa />
                    </span>
                  </div>
                </div>

                <button className="auth-botao" type="submit" disabled={enviando}>
                  {enviando ? TEXTOS_ESQUECI_SENHA.BOTAO_ENVIANDO : TEXTOS_ESQUECI_SENHA.BOTAO}
                </button>
              </form>

              <p className="auth-rodape">
                Lembrou a senha? <Link to={ROTAS.LOGIN}>Entrar</Link>
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
});
