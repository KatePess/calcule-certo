import { observer } from 'mobx-react-lite';
import { ITENS_MENU } from '../constantes/menu.js';
import { useSessaoStore } from '../stores/index.jsx';
import { primeiroNome } from '../utils/formatadores.js';
import '../estilos/home.css';

export default observer(function Home() {
  const sessao = useSessaoStore();
  const { usuario } = sessao;

  return (
    <div className="home">
      <nav className="home__menu">
        <p className="home__marca">Calcule Certo</p>
        <div className="home__itens">
          {ITENS_MENU.map((item, indice) => (
            <span key={item} className={`home__item ${indice === 0 ? 'home__item--ativo' : ''}`}>
              {item}
            </span>
          ))}
        </div>
        <button className="home__sair" type="button" onClick={() => sessao.sair()}>
          Sair
        </button>
      </nav>

      <main className="home__conteudo">
        <h1 className="home__saudacao">Olá, {primeiroNome(usuario.nome)}!</h1>
        <p className="home__sub">Acompanhe por aqui o status das suas atividades</p>

        <section className="home__cartao">
          <h2>Sessão autenticada</h2>
          <dl className="home__dados">
            <dt>Nome:</dt>
            <dd>{usuario.nome}</dd>
            <dt>E-mail:</dt>
            <dd>{usuario.email}</dd>
            <dt>CNPJ:</dt>
            <dd>{usuario.cnpj || 'não informado'}</dd>
          </dl>
        </section>

        <p className="home__nota">
          Esta tela é um marcador da Sprint 1. As telas de orçamento, cálculo e relatórios
          descritas no TCC serão desenvolvidas nas próximas sprints.
        </p>
      </main>
    </div>
  );
});
