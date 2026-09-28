import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconeGoogle,
  IconeLinkedin,
  IconeOlho,
  IconeOlhoCortado,
} from '../componentes/Icones.jsx';
import { DICAS, TEXTOS_CADASTRO, VALIDACAO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { TAMANHO_MINIMO_SENHA } from '../constantes/validacao.js';
import { useSessaoStore } from '../stores/index.jsx';
import { apenasDigitos, formatarCnpj } from '../utils/formatadores.js';
import {
  ehCnpjValido,
  ehEmailValido,
  ehNomeValido,
  ehSenhaValida,
  primeiroErro,
} from '../utils/validadores.js';
import '../estilos/auth.css';

const FORMULARIO_VAZIO = { nome: '', cnpj: '', email: '', senha: '' };

export default observer(function Cadastro() {
  const sessao = useSessaoStore();
  const navegar = useNavigate();

  const [form, setForm] = useState(FORMULARIO_VAZIO);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    // Valida na tela para avisar na hora; o servidor valida de novo.
    const problema = primeiroErro([
      [ehNomeValido(form.nome), VALIDACAO.NOME],
      [ehCnpjValido(form.cnpj), VALIDACAO.CNPJ],
      [ehEmailValido(form.email), VALIDACAO.EMAIL],
      [ehSenhaValida(form.senha), VALIDACAO.SENHA_CURTA],
    ]);
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await sessao.cadastrar({ ...form, cnpj: apenasDigitos(form.cnpj) });
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
        <section className="auth-painel auth-painel--escuro">
          <div className="auth-painel__texto">
            <p className="auth-painel__marca">
              Calcule <span>Certo</span>
            </p>
            <h1 className="auth-painel__titulo">{TEXTOS_CADASTRO.PAINEL_TITULO}</h1>
            <p className="auth-painel__legenda">{TEXTOS_CADASTRO.PAINEL_LEGENDA}</p>
          </div>
        </section>

        <section className="auth-lado auth-lado--destaque">
          <h2 className="auth-titulo">{TEXTOS_CADASTRO.TITULO}</h2>
          <p className="auth-legenda">{TEXTOS_CADASTRO.LEGENDA}</p>

          <form onSubmit={aoEnviar} noValidate>
            {erro && (
              <p className="aviso-erro" role="alert">
                {erro}
              </p>
            )}

            <div className="campo">
              <label className="campo__rotulo" htmlFor="nome">
                Nome completo
              </label>
              <div className="campo__caixa">
                <input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => alterar('nome', e.target.value)}
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="cnpj">
                CNPJ
              </label>
              <div className="campo__caixa">
                <input
                  id="cnpj"
                  inputMode="numeric"
                  value={form.cnpj}
                  onChange={(e) => alterar('cnpj', formatarCnpj(e.target.value))}
                  placeholder="Apenas números"
                />
              </div>
              <small className="campo__ajuda">Opcional nesta etapa.</small>
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="email-cadastro">
                E-mail
              </label>
              <div className="campo__caixa">
                <input
                  id="email-cadastro"
                  type="email"
                  value={form.email}
                  onChange={(e) => alterar('email', e.target.value)}
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="campo">
              <label className="campo__rotulo" htmlFor="senha-cadastro">
                Senha
              </label>
              <div className="campo__caixa">
                <input
                  id="senha-cadastro"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={(e) => alterar('senha', e.target.value)}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
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
              <small className="campo__ajuda">Mínimo de {TAMANHO_MINIMO_SENHA} caracteres.</small>
            </div>

            <button className="auth-botao auth-botao--claro" type="submit" disabled={enviando}>
              {enviando ? TEXTOS_CADASTRO.BOTAO_ENVIANDO : TEXTOS_CADASTRO.BOTAO}
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
            Já possui uma conta? <Link to={ROTAS.LOGIN}>Entrar</Link>
          </p>
        </section>
      </main>
    </div>
  );
});
