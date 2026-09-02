import { useSessao } from '../sessao.jsx';
import '../estilos/home.css';

const MENU = ['Home', 'Orçamento', 'Relatórios', 'Perfil', 'Resumo do sistema'];

export default function Home() {
  const { usuario, sair } = useSessao();

  return (
    <div className="home">
      <nav className="home__menu">
        <p className="home__marca">Calcule Certo</p>
        <div className="home__itens">
          {MENU.map((item, indice) => (
            <span key={item} className={`home__item ${indice === 0 ? 'home__item--ativo' : ''}`}>
              {item}
            </span>
          ))}
        </div>
        <button className="home__sair" type="button" onClick={sair}>
          Sair
        </button>
      </nav>

      <main className="home__conteudo">
        <h1 className="home__saudacao">Olá, {usuario.nome.split(' ')[0]}!</h1>
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
}
