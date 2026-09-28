import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconeGoogle,
  IconeLinkedin,
  IconeOlho,
  IconeOlhoCortado,
  IconePessoa,
} from '../componentes/Icones.jsx';
import { DICAS, MENSAGENS, TEXTOS_LOGIN, VALIDACAO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { useSessaoStore } from '../stores/index.jsx';
import { ehEmailValido, estaPreenchido, primeiroErro } from '../utils/validadores.js';
import '../estilos/auth.css';

export default observer(function Login() {
  const sessao = useSessaoStore();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    // Valida na tela para avisar na hora; o servidor valida de novo.
    const problema = primeiroErro([
      [ehEmailValido(email), VALIDACAO.EMAIL],
      [estaPreenchido(senha), VALIDACAO.SENHA_VAZIA],
    ]);
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await sessao.entrar(email, senha, lembrar);
      navegar(ROTAS.HOME, { replace: true });
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
            <h1 className="auth-painel__titulo">{TEXTOS_LOGIN.PAINEL_TITULO}</h1>
            <p className="auth-painel__legenda">{TEXTOS_LOGIN.PAINEL_LEGENDA}</p>
          </div>
        </section>

        <section className="auth-lado">
          <h2 className="auth-titulo">{TEXTOS_LOGIN.TITULO}</h2>
          <p className="auth-legenda">{TEXTOS_LOGIN.LEGENDA}</p>

          <form onSubmit={aoEnviar} noValidate>
            {erro && (
              <p className="aviso-erro" role="alert">
                {erro}
              </p>
            )}
            {!erro && sessao.aviso && (
              <p className="aviso-info" role="status">
                {sessao.aviso}
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
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                />
                Lembrar minha senha
              </label>
              <button
                type="button"
                className="auth-link"
                title={DICAS.RECUPERAR_SENHA}
                onClick={() => setErro(MENSAGENS.RECUPERACAO_INDISPONIVEL)}
              >
                Esqueci minha senha →
              </button>
            </div>

            <button className="auth-botao" type="submit" disabled={enviando}>
              {enviando ? TEXTOS_LOGIN.BOTAO_ENVIANDO : TEXTOS_LOGIN.BOTAO}
            </button>
          </form>

          <p className="auth-divisor">Ou continue com</p>
          <div className="auth-social">
            <button type="button" disabled title={DICAS.LOGIN_SOCIAL}>
              <IconeGoogle />
            </button>
            <button type="button" disabled title={DICAS.LOGIN_SOCIAL}>
              <IconeLinkedin />
            </button>
          </div>

          <p className="auth-rodape">
            Ainda não tem conta? <Link to={ROTAS.CADASTRO}>Cadastre-se</Link>
          </p>
        </section>
      </main>
    </div>
  );
});
