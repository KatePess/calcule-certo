import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconeGoogle,
  IconeLinkedin,
  IconeOlho,
  IconeOlhoCortado,
  IconeSetaDireita,
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
import '../estilos/cadastro.css';

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
    <div className="cadastro-fundo">
      <main className="cadastro">
        {/* Painel azul com a borda em diagonal; so decoracao, atras do formulario. */}
        <div className="cadastro__azul" aria-hidden="true" />

        <section className="cadastro__boas-vindas">
          <p className="cadastro__marca">
            Calcule <span>Certo</span>
          </p>
          <div className="cadastro__saudacao">
            <h1>{TEXTOS_CADASTRO.PAINEL_TITULO}</h1>
            <p>{TEXTOS_CADASTRO.PAINEL_LEGENDA}</p>
          </div>
        </section>

        <section className="cadastro__formulario" aria-labelledby="titulo-cadastro">
          <h2 id="titulo-cadastro">{TEXTOS_CADASTRO.TITULO}</h2>

          <form onSubmit={aoEnviar} noValidate>
            {erro && (
              <p className="aviso-erro" role="alert">
                {erro}
              </p>
            )}

            <div className="cadastro-campo">
              <label htmlFor="nome">Nome completo</label>
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

            {/* O prototipo pede CPF; o sistema segue o diagrama de classes do TCC (CNPJ). */}
            <div className="cadastro-campo">
              <label htmlFor="cnpj">CNPJ (opcional)</label>
              <input
                id="cnpj"
                inputMode="numeric"
                value={form.cnpj}
                onChange={(e) => alterar('cnpj', formatarCnpj(e.target.value))}
                placeholder="Apenas números"
              />
            </div>

            <div className="cadastro-campo">
              <label htmlFor="email-cadastro">E-mail</label>
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

            <div className="cadastro-campo">
              <label htmlFor="senha-cadastro">Senha</label>
              <div className="cadastro-campo__senha">
                <input
                  id="senha-cadastro"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={form.senha}
                  onChange={(e) => alterar('senha', e.target.value)}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  aria-describedby="ajuda-senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <IconeOlho /> : <IconeOlhoCortado />}
                </button>
              </div>
              <small id="ajuda-senha" className="cadastro-campo__ajuda">
                Mínimo de {TAMANHO_MINIMO_SENHA} caracteres.
              </small>
            </div>

            <button className="cadastro__enviar" type="submit" disabled={enviando}>
              {enviando ? TEXTOS_CADASTRO.BOTAO_ENVIANDO : TEXTOS_CADASTRO.BOTAO}
            </button>
          </form>

          <p className="cadastro__divisor">{TEXTOS_CADASTRO.OUTRAS_FORMAS}</p>
          <div className="cadastro__social">
            <button type="button" disabled title={DICAS.LOGIN_SOCIAL} aria-label="Entrar com Google (em breve)">
              <IconeGoogle tamanho={48} />
            </button>
            <button type="button" disabled title={DICAS.LOGIN_SOCIAL} aria-label="Entrar com LinkedIn (em breve)">
              <IconeLinkedin tamanho={48} />
            </button>
          </div>
        </section>

        <section className="cadastro__entrar">
          <p>{TEXTOS_CADASTRO.JA_TEM_CONTA}</p>
          <Link to={ROTAS.LOGIN} className="botao-site botao-site--grande">
            {TEXTOS_CADASTRO.ENTRAR} <IconeSetaDireita tamanho={20} />
          </Link>
        </section>
      </main>
    </div>
  );
});
