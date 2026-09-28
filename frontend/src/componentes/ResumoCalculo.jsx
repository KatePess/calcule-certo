import { useState } from 'react';
import { TEXTOS_CALCULO } from '../constantes/mensagens.js';
import { formatarMoeda, formatarPercentual } from '../utils/moeda.js';
import { IconeCheck } from './Icones.jsx';

function ehNegativo(valor) {
  return String(valor).startsWith('-');
}

function semSinal(valor) {
  return String(valor).replace(/^-/, '');
}

// "25" -> "75"; "33.3333" -> "66.6667". Conta em inteiros (x 10.000) para
// evitar o erro de ponto flutuante de 100 - 33.3333 em JavaScript.
function complementoPercentual(percentual) {
  const [inteiro, decimal = ''] = String(percentual).split('.');
  const escalado = Number(inteiro) * 10000 + Number(decimal.padEnd(4, '0').slice(0, 4));
  const resto = 1000000 - escalado;
  const texto = `${Math.floor(resto / 10000)}.${String(resto % 10000).padStart(4, '0')}`;
  return texto.replace(/\.?0+$/, '');
}

// Frase que compara o novo orcamento com o que a empresa cobraria hoje.
function Comparacao({ comparacao }) {
  if (!comparacao) return null;
  const { orcamentoEmpresa, lucroComOrcamentoAtual, diferenca } = comparacao;
  const prejuizo = ehNegativo(lucroComOrcamentoAtual);
  const diferencaZero = Number(diferenca) === 0;

  return (
    <div className={`resumo__comparacao ${prejuizo ? 'resumo__comparacao--prejuizo' : ''}`}>
      <p>
        Com o orçamento atual de <b>{formatarMoeda(orcamentoEmpresa)}</b>, a empresa teria{' '}
        <b>
          {prejuizo ? 'prejuízo' : 'lucro'} de {formatarMoeda(semSinal(lucroComOrcamentoAtual))}
        </b>
        .
      </p>
      {!diferencaZero && (
        <p>
          O novo orçamento é {formatarMoeda(semSinal(diferenca))} {ehNegativo(diferenca) ? 'menor' : 'maior'}.
        </p>
      )}
    </div>
  );
}

// Detalhamento pedido no estudo de caso: mostra de onde sai cada valor.
function Detalhamento({ resultado, form }) {
  const linhas = [
    [`Custo direto (R$ ${form.custoVariavel || '0,00'} × ${form.quantidadeItens} itens)`, resultado.custoDireto],
    ['Custo indireto (custo fixo + seguro)', resultado.custoIndireto],
    ['Custo total', resultado.custoTotal, true],
    [`Taxa da plataforma (${formatarPercentual(form.taxaPlataforma)})`, resultado.valorTaxaPlataforma],
    [`Comissão de terceiros (${formatarPercentual(form.comissaoTerceiros)})`, resultado.valorComissao],
    ...resultado.taxasAdicionais.map((taxa) => [`${taxa.nome} (${formatarPercentual(taxa.percentual)})`, taxa.valor]),
    [`Lucro estimado (${formatarPercentual(form.margemLucro)} do preço)`, resultado.lucroEstimado],
    ['Novo orçamento', resultado.resultadoFinal, true],
  ];

  return (
    <div className="resumo__detalhes">
      <table>
        <tbody>
          {linhas.map(([rotulo, valor, destaque]) => (
            <tr key={rotulo} className={destaque ? 'resumo__detalhes-total' : ''}>
              <td>{rotulo}</td>
              <td>{formatarMoeda(valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="resumo__nota">
        Taxas, comissão e margem são cobradas sobre o preço final e somam{' '}
        {formatarPercentual(resultado.percentualSobrePreco)} dele. Por isso o novo orçamento é o custo total
        dividido por {formatarPercentual(complementoPercentual(resultado.percentualSobrePreco))}, a parte do preço que
        sobra depois delas.
      </p>
    </div>
  );
}

// Conteudo do modal da Figura C2.
export default function ResumoCalculo({ resultado, avisos, form, erro, salvando, aoAtualizar, aoSalvar }) {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const lucroNegativo = ehNegativo(resultado.lucroEstimado);

  return (
    <div className="resumo">
      <div className="resumo__cartao">
        <p className="resumo__titulo">{TEXTOS_CALCULO.RESUMO_TITULO}</p>
        <span className="resumo__check">
          <IconeCheck tamanho={26} />
        </span>

        <div className="resumo__linha">
          <span>{TEXTOS_CALCULO.NOVO_ORCAMENTO}</span>
          <strong className="valor-positivo">{formatarMoeda(resultado.resultadoFinal)}</strong>
        </div>
        <div className="resumo__linha">
          <span>{TEXTOS_CALCULO.CUSTOS_TOTAIS}</span>
          <strong>{formatarMoeda(resultado.custoTotal)}</strong>
        </div>
        <div className="resumo__linha">
          <span>{TEXTOS_CALCULO.TOTAL_TAXAS}</span>
          <strong>{formatarMoeda(resultado.totalTaxasEMargem)}</strong>
        </div>
        <div className="resumo__linha">
          <span>{TEXTOS_CALCULO.LUCRO}</span>
          <strong className={lucroNegativo ? 'valor-negativo' : 'valor-positivo'}>{formatarMoeda(resultado.lucroEstimado)}</strong>
        </div>
      </div>

      <Comparacao comparacao={resultado.comparacao} />

      {avisos.map((aviso) => (
        <p key={aviso} className="resumo__aviso" role="status">
          {aviso}
        </p>
      ))}

      <button type="button" className="resumo__alternar" onClick={() => setMostrarDetalhes((v) => !v)} aria-expanded={mostrarDetalhes}>
        {mostrarDetalhes ? TEXTOS_CALCULO.OCULTAR_DETALHES : TEXTOS_CALCULO.VER_DETALHES}
      </button>
      {mostrarDetalhes && <Detalhamento resultado={resultado} form={form} />}

      {erro && (
        <p className="aviso-erro" role="alert">
          {erro}
        </p>
      )}

      <div className="resumo__acoes">
        <button type="button" className="botao botao--secundario" onClick={aoAtualizar}>
          {TEXTOS_CALCULO.ATUALIZAR}
        </button>
        <button type="button" className="botao botao--primario" onClick={aoSalvar} disabled={salvando}>
          {salvando ? TEXTOS_CALCULO.SALVANDO : TEXTOS_CALCULO.SALVAR}
        </button>
      </div>
    </div>
  );
}
