import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IconeOlho, IconeOlhoCortado } from '../componentes/Icones.jsx';
import { STATUS_HTTP } from '../constantes/api.js';
import { TEXTOS_REDEFINIR_SENHA, VALIDACAO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { TAMANHO_MINIMO_SENHA } from '../constantes/validacao.js';
import { useSessaoStore } from '../stores/index.jsx';
import { ehSenhaValida, primeiroErro } from '../utils/validadores.js';
import '../estilos/auth.css';

// Tela aberta pelo link do e-mail (/redefinir-senha?token=...). Funciona
// mesmo com uma sessao aberta neste navegador; ao salvar, ela e encerrada.
export default observer(function RedefinirSenha() {
  const sessao = useSessaoStore();
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const token = parametros.get('token') ?? '';

  const [form, setForm] = useState({ nova: '', confirmacao: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState(token ? '' : TEXTOS_REDEFINIR_SENHA.LINK_INCOMPLETO);
  // Link vencido ou ja usado: so resta pedir outro.
  const [linkInvalido, setLinkInvalido] = useState(!token);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    const problema = primeiroErro([
      [ehSenhaValida(form.nova), VALIDACAO.SENHA_CURTA],
      [form.nova === form.confirmacao, TEXTOS_REDEFINIR_SENHA.SENHAS_DIFERENTES],
    ]);
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setEnviando(true);
    try {
      await sessao.redefinirSenha(token, form.nova);
      navegar(ROTAS.LOGIN, { replace: true });
    } catch (falha) {
      setErro(falha.message);
      // A senha ja foi validada na tela com a mesma regra do servidor, entao
      // um 400 so pode ser o link. Falha de rede mantem o formulario.
      if (falha.status === STATUS_HTTP.REQUISICAO_INVALIDA) setLinkInvalido(true);
      setEnviando(false);
    }
  }

  const campoSenha = (chave, id, rotulo, placeholder) => (
    <div className="campo">
      <label className="campo__rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <div className="campo__caixa">
        <input
          id={id}
          type={mostrarSenha ? 'text' : 'password'}
          value={form[chave]}
          onChange={(e) => setForm({ ...form, [chave]: e.target.value })}
          placeholder={placeholder}
          autoComplete="new-password"
          required
          autoFocus={chave === 'nova'}
        />
        {chave === 'nova' && (
          <button
            type="button"
            className="campo__icone"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? 'Ocultar senhas' : 'Mostrar senhas'}
          >
            {mostrarSenha ? <IconeOlho /> : <IconeOlhoCortado />}
          </button>
        )}
      </div>
      {chave === 'nova' && <small className="campo__ajuda">Mínimo de {TAMANHO_MINIMO_SENHA} caracteres.</small>}
    </div>
  );

  return (
    <div className="auth-fundo">
      <main className="auth-cartao">
        <section className="auth-painel">
          <div className="auth-painel__texto">
            <h1 className="auth-painel__titulo">{TEXTOS_REDEFINIR_SENHA.PAINEL_TITULO}</h1>
            <p className="auth-painel__legenda">{TEXTOS_REDEFINIR_SENHA.PAINEL_LEGENDA}</p>
          </div>
        </section>

        <section className="auth-lado">
          <h2 className="auth-titulo">{TEXTOS_REDEFINIR_SENHA.TITULO}</h2>
          <p className="auth-legenda">{TEXTOS_REDEFINIR_SENHA.LEGENDA}</p>

          {erro && (
            <p className="aviso-erro" role="alert">
              {erro}
            </p>
          )}

          {linkInvalido ? (
            <Link to={ROTAS.ESQUECI_SENHA} className="auth-botao">
              {TEXTOS_REDEFINIR_SENHA.PEDIR_NOVO}
            </Link>
          ) : (
            <form onSubmit={aoEnviar} noValidate>
              {campoSenha('nova', 'nova-senha', 'Nova senha', 'Crie uma senha')}
              {campoSenha('confirmacao', 'confirmar-senha', 'Repita a nova senha', 'Digite a senha de novo')}
              <button className="auth-botao" type="submit" disabled={enviando}>
                {enviando ? TEXTOS_REDEFINIR_SENHA.BOTAO_ENVIANDO : TEXTOS_REDEFINIR_SENHA.BOTAO}
              </button>
            </form>
          )}

          <p className="auth-rodape">
            <Link to={ROTAS.LOGIN}>Voltar para o login</Link>
          </p>
        </section>
      </main>
    </div>
  );
});
