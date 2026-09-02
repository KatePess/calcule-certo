import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconeGoogle, IconeLinkedin, IconeOlho, IconeOlhoCortado, IconePessoa } from '../componentes/Icones.jsx';
import { useSessao } from '../sessao.jsx';
import '../estilos/auth.css';

export default function Login() {
  const { entrar } = useSessao();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha, lembrar);
      navegar('/home', { replace: true });
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
            <h1 className="auth-painel__titulo">BEM-VINDO AO CALCULE CERTO</h1>
            <p className="auth-painel__legenda">Seu sistema mais completo de cálculo de licitações!</p>
          </div>
        </section>

        <section className="auth-lado">
          <h2 className="auth-titulo">Acesse sua conta</h2>
          <p className="auth-legenda">Use o e-mail e a senha cadastrados para acessar sua conta.</p>

          <form onSubmit={aoEnviar} noValidate>
            {erro && (
              <p className="aviso-erro" role="alert">
                {erro}
              </p>
            )}

            <div className="campo">
              <label className="campo__rotulo" htmlFor="email">
                E-mail
              </label>
              <div className="campo__caixa">
                <input
                  id="email"
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

            <div className="campo">
              <label className="campo__rotulo" htmlFor="senha">
                Senha
              </label>
              <div className="campo__caixa">
                <input
                  id="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="campo__icone"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <IconeOlho /> : <IconeOlhoCortado />}
                </button>
              </div>
            </div>

            <div className="auth-opcoes">
              <label>
                <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} />
                Lembrar minha senha
              </label>
              <button
                type="button"
                className="auth-link"
                title="Recuperação de senha prevista para a próxima sprint"
                onClick={() => setErro('Recuperação de senha ainda não implementada (próxima sprint).')}
              >
                Esqueci minha senha →
              </button>
            </div>

            <button className="botao" type="submit" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-divisor">Ou continue com</p>
          <div className="auth-social">
            <button type="button" disabled title="Login social previsto para uma sprint futura">
              <IconeGoogle />
            </button>
            <button type="button" disabled title="Login social previsto para uma sprint futura">
              <IconeLinkedin />
            </button>
          </div>

          <p className="auth-rodape">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
