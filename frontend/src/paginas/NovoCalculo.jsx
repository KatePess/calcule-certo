import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CampoMoeda from '../componentes/CampoMoeda.jsx';
import CampoPercentual from '../componentes/CampoPercentual.jsx';
import { IconeCartao, IconeCasa, IconeCheck, IconeChevron, IconeResumo } from '../componentes/Icones.jsx';
import Modal from '../componentes/Modal.jsx';
import ResumoCalculo from '../componentes/ResumoCalculo.jsx';
import SeletorLicitacao from '../componentes/SeletorLicitacao.jsx';
import SeletorTaxaSalva from '../componentes/SeletorTaxaSalva.jsx';
import TaxasAdicionais from '../componentes/TaxasAdicionais.jsx';
import { ROTULOS_CALCULO } from '../constantes/calculo.js';
import { TEXTOS_CALCULO } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { TIPOS_TAXA } from '../constantes/taxa.js';
import { useCalculoStore, useTaxaStore } from '../stores/index.jsx';
import { formatarDataLocal } from '../utils/datas.js';
import { apiParaPercentual } from '../utils/moeda.js';
import '../estilos/calculo.css';

// Figura C1 (formulario) + Figura C2 (modal de resumo) do TCC.
export default observer(function NovoCalculo() {
  const calculo = useCalculoStore();
  const taxas = useTaxaStore();
  const navegar = useNavigate();
  const { calculoId } = useParams();
  const { form } = calculo;
  const licitacao = calculo.licitacaoSelecionada;

  useEffect(() => {
    calculo.carregarLicitacoes();
    taxas.carregarSeNecessario();
  }, [calculo, taxas]);

  // Preenche o campo com uma taxa salva no Perfil.
  function usarTaxaSalva(campo, tipo) {
    return (
      <SeletorTaxaSalva
        tipo={tipo}
        descricao={`Usar taxa salva em ${ROTULOS_CALCULO[campo]}`}
        aoEscolher={(taxa) => calculo.alterar(campo, apiParaPercentual(taxa.percentual))}
      />
    );
  }

  // /orcamento/:calculoId = refazer a partir de um relatorio;
  // /orcamento = calculo novo (descarta uma edicao que estava aberta).
  useEffect(() => {
    if (calculoId) calculo.carregarParaEdicao(calculoId);
    else if (calculo.edicao) calculo.novoCalculo();
  }, [calculo, calculoId]);

  function fazerOutroCalculo() {
    calculo.novoCalculo();
    if (calculoId) navegar(ROTAS.ORCAMENTO);
  }

  function campoMoeda(campo, extras = {}) {
    return (
      <CampoMoeda
        id={campo}
        rotulo={ROTULOS_CALCULO[campo]}
        valor={form[campo]}
        aoMudar={(valor) => calculo.alterar(campo, valor)}
        {...extras}
      />
    );
  }

  function campoPercentual(campo, extras = {}) {
    return (
      <CampoPercentual
        id={campo}
        rotulo={ROTULOS_CALCULO[campo]}
        valor={form[campo]}
        aoMudar={(valor) => calculo.alterar(campo, valor)}
        {...extras}
      />
    );
  }

  return (
    <section className="pagina">
      <nav className="migalhas" aria-label="Você está em">
        <Link to={ROTAS.HOME}>
          <IconeCasa tamanho={16} /> Home
        </Link>
        <IconeChevron tamanho={14} />
        <span>Orçamento</span>
        <IconeChevron tamanho={14} />
        <span className="migalhas__atual">{calculo.edicao ? 'Refazer cálculo' : 'Novo cálculo'}</span>
      </nav>

      <h1 className="pagina__titulo calculo__titulo">{TEXTOS_CALCULO.TITULO}</h1>
      <p className="calculo__licitacao">
        {licitacao ? `(Licitação ${licitacao.numero} · ${licitacao.orgao})` : '(escolha a licitação abaixo)'}
      </p>

      {calculo.edicao && (
        <p className="aviso-info calculo__edicao" role="status">
          Você está refazendo o cálculo de {formatarDataLocal(calculo.edicao.criadoEm)}. Ao salvar, um novo relatório
          será criado; o anterior continua no histórico.
        </p>
      )}

      <SeletorLicitacao />

      <form
        className="calculo"
        noValidate
        onSubmit={(evento) => {
          evento.preventDefault();
          calculo.simular();
        }}
      >
        {calculo.erro && (
          <p className="aviso-erro" role="alert">
            {calculo.erro}
          </p>
        )}

        <div className="calculo__blocos">
          <section className="bloco" aria-labelledby="bloco-custo">
            <h2 className="bloco__titulo" id="bloco-custo">
              <IconeCartao tamanho={22} />
              {TEXTOS_CALCULO.BLOCO_CUSTO}
            </h2>
            {campoMoeda('orcamentoEmpresa', { ajuda: 'Opcional: o preço que a empresa cobraria hoje, para comparar.' })}
            <div className="campo-calculo">
              <label htmlFor="quantidadeItens">{ROTULOS_CALCULO.quantidadeItens}</label>
              <div className="campo-calculo__caixa">
                <input
                  id="quantidadeItens"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={7}
                  value={form.quantidadeItens}
                  placeholder="Ex.: 10"
                  onChange={(evento) => calculo.alterar('quantidadeItens', evento.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
            {campoMoeda('custoFixo')}
            {campoMoeda('custoVariavel')}
          </section>

          <section className="bloco" aria-labelledby="bloco-parametros">
            <h2 className="bloco__titulo" id="bloco-parametros">
              <IconeResumo tamanho={22} />
              {TEXTOS_CALCULO.BLOCO_PARAMETROS}
            </h2>
            {campoPercentual('taxaPlataforma', { placeholder: 'Ex.: 5', acessorio: usarTaxaSalva('taxaPlataforma', TIPOS_TAXA.PLATAFORMA) })}
            {campoMoeda('seguro', { ajuda: 'Opcional. Valor em reais somado ao custo.' })}
            {campoPercentual('comissaoTerceiros', { placeholder: 'Ex.: 10', acessorio: usarTaxaSalva('comissaoTerceiros', TIPOS_TAXA.COMISSAO) })}
            {campoPercentual('margemLucro', { placeholder: 'Ex.: 10' })}
            <TaxasAdicionais />
          </section>
        </div>

        <p className="calculo__instrucao">
          {TEXTOS_CALCULO.INSTRUCAO_INICIO} <b>CONFIRMAR</b> {TEXTOS_CALCULO.INSTRUCAO_FIM}
        </p>

        <div className="calculo__acoes">
          <button type="submit" className="botao-confirmar" disabled={calculo.simulando}>
            {calculo.simulando ? TEXTOS_CALCULO.CALCULANDO : TEXTOS_CALCULO.CONFIRMAR}
          </button>
        </div>
      </form>

      {calculo.resultado && (
        <Modal aoFechar={() => calculo.voltarParaEdicao()}>
          <ResumoCalculo
            resultado={calculo.resultado}
            avisos={calculo.avisos}
            form={form}
            erro={calculo.erroResumo}
            salvando={calculo.salvando}
            aoAtualizar={() => calculo.voltarParaEdicao()}
            aoSalvar={() => calculo.salvar()}
          />
        </Modal>
      )}

      {calculo.salvo && (
        <Modal aoFechar={fazerOutroCalculo} largura="estreita">
          <div className="salvo">
            <span className="resumo__check">
              <IconeCheck tamanho={26} />
            </span>
            <h2>{TEXTOS_CALCULO.SALVO_TITULO}</h2>
            <p>{TEXTOS_CALCULO.SALVO_TEXTO}</p>
            <div className="resumo__acoes">
              <button type="button" className="botao botao--secundario" onClick={fazerOutroCalculo}>
                {TEXTOS_CALCULO.OUTRO_CALCULO}
              </button>
              <button
                type="button"
                className="botao botao--primario"
                onClick={() => {
                  calculo.novoCalculo();
                  navegar(ROTAS.RELATORIOS);
                }}
              >
                {TEXTOS_CALCULO.VER_RELATORIOS}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
});
