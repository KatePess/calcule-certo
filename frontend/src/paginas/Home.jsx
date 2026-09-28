import { observer } from 'mobx-react-lite';
import { useSessaoStore } from '../stores/index.jsx';
import { exibirCnpj, primeiroNome } from '../utils/formatadores.js';

// Tela inicial provisoria. Sera substituida pelo Painel na Sprint 5.
export default observer(function Home() {
  const { usuario } = useSessaoStore();

  return (
    <section className="pagina">
      <h1 className="pagina__titulo pagina__titulo--grande">Olá, {primeiroNome(usuario.nome)}!</h1>
      <p className="pagina__legenda pagina__legenda--destaque">Acompanhe por aqui o status das suas atividades</p>

      <div className="cartao">
        <h2 className="cartao__titulo">Sessão autenticada</h2>
        <dl className="dados">
          <dt>Nome</dt>
          <dd>{usuario.nome}</dd>
          <dt>E-mail</dt>
          <dd>{usuario.email}</dd>
          <dt>CNPJ</dt>
          <dd>{exibirCnpj(usuario.cnpj) || 'não informado'}</dd>
        </dl>
      </div>
    </section>
  );
});
