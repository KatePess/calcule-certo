import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconeGoogle, IconeLinkedin, IconeOlho, IconeOlhoCortado } from '../componentes/Icones.jsx';
import { useSessao } from '../sessao.jsx';
import '../estilos/auth.css';

// Formata o CNPJ enquanto o usuario digita: 00.000.000/0000-00
function formatarCnpj(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 14);
  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export default function Cadastro() {
  const { cadastrar } = useSessao();
  const navegar = useNavigate();

  const [form, setForm] = useState({ nome: '', cnpj: '', email: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function alterar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await cadastrar({ ...form, cnpj: form.cnpj.replace(/\D/g, '') });
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
        <section className="auth-painel auth-painel--escuro">
          <div className="auth-painel__texto">
            <p className="auth-painel__marca">
              Calcule <span>Certo</span>
            </p>
            <h1 className="auth-painel__titulo">Olá!</h1>
            <p className="auth-painel__legenda">Crie sua conta gratuitamente, de forma rápida e segura.</p>
          </div>
        </section>

        <section className="auth-lado auth-lado--destaque">
          <h2 className="auth-titulo">Criar conta</h2>
          <p className="auth-legenda">Preencha os dados abaixo para começar a usar o sistema.</p>

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
              <small className="campo__ajuda">Mínimo de 8 caracteres.</small>
            </div>

            <button className="botao botao--claro" type="submit" disabled={enviando}>
              {enviando ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="auth-divisor">Ou continue com</p>
          <div className="auth-social">
            <button type="button" disabled title="Cadastro social previsto para uma sprint futura">
              <IconeGoogle />
            </button>
            <button type="button" disabled title="Cadastro social previsto para uma sprint futura">
              <IconeLinkedin />
            </button>
          </div>

          <p className="auth-rodape">
            Já possui uma conta? <Link to="/login">Entrar</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
