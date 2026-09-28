import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { DICAS } from '../../constantes/mensagens.js';
import { useSessaoStore } from '../../stores/index.jsx';
import { iniciais } from '../../utils/formatadores.js';
import { IconeAjuda, IconeBusca, IconeMenu } from '../Icones.jsx';
import Modal from '../Modal.jsx';

export default observer(function Cabecalho({ aoAbrirMenu }) {
  const sessao = useSessaoStore();
  const [ajudaAberta, setAjudaAberta] = useState(false);

  return (
    <header className="cabecalho">
      <button type="button" className="cabecalho__menu" aria-label="Abrir menu" onClick={aoAbrirMenu}>
        <IconeMenu />
      </button>

      {/* A busca geral esta fora do escopo do TCC; o campo fica visivel, mas desativado. */}
      <label className="cabecalho__busca" title={DICAS.BUSCA_GLOBAL}>
        <IconeBusca />
        <input type="search" placeholder="Pesquisar" disabled aria-label="Pesquisar (indisponível)" />
      </label>

      <div className="cabecalho__acoes">
        <button type="button" className="cabecalho__icone" aria-label="Ajuda" onClick={() => setAjudaAberta(true)}>
          <IconeAjuda tamanho={22} />
        </button>
        <span className="cabecalho__avatar" title={sessao.usuario?.nome}>
          {iniciais(sessao.usuario?.nome)}
        </span>
      </div>

      {ajudaAberta && (
        <Modal titulo="Como usar o Calcule Certo" aoFechar={() => setAjudaAberta(false)}>
          <ol className="ajuda">
            <li>Em <b>Resumo do sistema</b>, cadastre a licitação: número, órgão e data de abertura.</li>
            <li>Em <b>Orçamento</b>, escolha a licitação e preencha o custo base e os parâmetros.</li>
            <li>Clique em <b>Confirmar</b> para ver o resumo do cálculo e salve em relatórios.</li>
            <li>Em <b>Relatórios</b>, baixe o PDF pronto para enviar.</li>
          </ol>
        </Modal>
      )}
    </header>
  );
});
