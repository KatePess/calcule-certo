// Motor de calculo do Calcule Certo. Funcao pura: nao acessa banco, rede ou
// HTTP; recebe numeros e devolve numeros. Por isso e facil de testar e, se o
// stakeholder mudar a regra, so este arquivo muda.
//
// Formula (secao 5 do plano de implementacao, pendente de validacao):
//   custo total  = custo variavel x quantidade + custo fixo + seguro
//   novo preco   = custo total / (1 - soma dos percentuais sobre o preco)
// As taxas incidem sobre o preco final, por isso se DIVIDE em vez de somar
// o percentual ao custo: somar faria a empresa perder parte da margem.
import {
  PERCENTUAL_AVISO,
  PERCENTUAL_LIMITE,
  QUANTIDADE_MAXIMA,
  ROTULOS_CAMPOS,
  VALOR_MAXIMO,
  VERSAO_FORMULA,
} from '../constantes/calculo.js';
import { STATUS } from '../constantes/http.js';
import { AVISOS, ERROS } from '../constantes/mensagens.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import {
  CEM,
  ZERO,
  arredondarCentavos,
  emTextoMonetario,
  emTextoPercentual,
  percentualDe,
} from '../utils/dinheiro.js';

function recusar(mensagem) {
  throw new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

// "12.5" -> "12,5", para as mensagens ao usuario.
function percentualLegivel(valor) {
  return valor.toString().replace('.', ',');
}

function validarPercentual(valor, rotulo) {
  if (valor.isNegative() || valor.greaterThanOrEqualTo(PERCENTUAL_LIMITE)) {
    recusar(ERROS.CALCULO_PERCENTUAL_FORA(rotulo));
  }
}

// Regras de dominio das entradas. O formato (texto, casas decimais) ja foi
// conferido pelo calculoServico antes de chegar aqui.
function validarEntrada(entrada) {
  const { quantidadeItens } = entrada;
  if (!Number.isInteger(quantidadeItens) || quantidadeItens < 1 || quantidadeItens > QUANTIDADE_MAXIMA) {
    recusar(ERROS.CALCULO_QUANTIDADE);
  }
  for (const campo of ['custoFixo', 'custoVariavel', 'seguro', 'orcamentoEmpresa']) {
    if (entrada[campo]?.isNegative()) recusar(ERROS.CALCULO_VALOR_NEGATIVO(ROTULOS_CAMPOS[campo]));
  }
  for (const campo of ['taxaPlataforma', 'comissaoTerceiros', 'margemLucro']) {
    validarPercentual(entrada[campo], ROTULOS_CAMPOS[campo]);
  }
  entrada.taxasAdicionais.forEach((taxa) => validarPercentual(taxa.percentual, taxa.nome));
}

// Classe Calculo do diagrama: processarCustos().
export function processarCustos({ custoVariavel, quantidadeItens, custoFixo, seguro }) {
  const custoDireto = custoVariavel.times(quantidadeItens);
  const custoIndireto = custoFixo.plus(seguro);
  return { custoDireto, custoIndireto, custoTotal: custoDireto.plus(custoIndireto) };
}

// Classe Calculo do diagrama: aplicarTaxas().
export function aplicarTaxas({ custoTotal }, entrada) {
  if (!custoTotal.greaterThan(ZERO)) recusar(ERROS.CALCULO_SEM_CUSTO);

  const somaAdicionais = entrada.taxasAdicionais.reduce((soma, taxa) => soma.plus(taxa.percentual), ZERO);
  const percentualSobrePreco = entrada.taxaPlataforma
    .plus(entrada.comissaoTerceiros)
    .plus(somaAdicionais)
    .plus(entrada.margemLucro);

  if (percentualSobrePreco.greaterThanOrEqualTo(PERCENTUAL_LIMITE)) {
    recusar(ERROS.CALCULO_SOMA_PERCENTUAIS(percentualLegivel(percentualSobrePreco)));
  }

  // Precisao total ate aqui; o arredondamento para centavos so vem no fim.
  const precoExato = custoTotal.dividedBy(CEM.minus(percentualSobrePreco).dividedBy(CEM));
  const resultadoFinal = arredondarCentavos(precoExato);
  if (resultadoFinal.greaterThan(VALOR_MAXIMO)) recusar(ERROS.CALCULO_ACIMA_LIMITE);

  const valorTaxaPlataforma = arredondarCentavos(percentualDe(precoExato, entrada.taxaPlataforma));
  const valorComissao = arredondarCentavos(percentualDe(precoExato, entrada.comissaoTerceiros));
  const taxasAdicionais = entrada.taxasAdicionais.map((taxa) => ({
    nome: taxa.nome,
    percentual: taxa.percentual,
    valor: arredondarCentavos(percentualDe(precoExato, taxa.percentual)),
  }));
  const valorTaxasAdicionais = taxasAdicionais.reduce((soma, taxa) => soma.plus(taxa.valor), ZERO);

  // O lucro absorve a diferenca de arredondamento das parcelas, para que
  // custo + taxas + comissao + lucro feche exatamente no preco final.
  const lucroEstimado = resultadoFinal
    .minus(arredondarCentavos(custoTotal))
    .minus(valorTaxaPlataforma)
    .minus(valorComissao)
    .minus(valorTaxasAdicionais);

  return {
    percentualSobrePreco,
    resultadoFinal,
    valorTaxaPlataforma,
    valorComissao,
    taxasAdicionais,
    valorTaxasAdicionais,
    lucroEstimado,
  };
}

// Quanto a empresa ganharia (ou perderia) mantendo o orcamento que usaria
// hoje. Devolve null quando o orcamento da empresa nao foi informado.
export function compararComOrcamento({
  orcamentoEmpresa,
  taxaPlataforma,
  comissaoTerceiros,
  taxasAdicionais,
  custoTotal,
  resultadoFinal,
}) {
  if (orcamentoEmpresa === null || orcamentoEmpresa === undefined) return null;

  const taxasSobreOrcamento = [taxaPlataforma, comissaoTerceiros, ...taxasAdicionais.map((taxa) => taxa.percentual)]
    .map((percentual) => arredondarCentavos(percentualDe(orcamentoEmpresa, percentual)))
    .reduce((soma, valor) => soma.plus(valor), ZERO);

  return {
    orcamentoEmpresa: emTextoMonetario(orcamentoEmpresa),
    lucroComOrcamentoAtual: emTextoMonetario(orcamentoEmpresa.minus(taxasSobreOrcamento).minus(custoTotal)),
    diferenca: emTextoMonetario(resultadoFinal.minus(orcamentoEmpresa)),
  };
}

// Recebe as entradas ja convertidas para Decimal (quantidade como inteiro) e
// devolve o resultado no formato da API, com valores em texto.
export function calcular(entrada) {
  validarEntrada(entrada);

  const custos = processarCustos(entrada);
  const taxas = aplicarTaxas(custos, entrada);
  const comparacao = compararComOrcamento({ ...entrada, ...custos, ...taxas });

  const avisos = [];
  if (taxas.percentualSobrePreco.greaterThan(PERCENTUAL_AVISO)) {
    avisos.push(AVISOS.PERCENTUAL_ALTO(percentualLegivel(taxas.percentualSobrePreco)));
  }

  return {
    resultado: {
      custoDireto: emTextoMonetario(custos.custoDireto),
      custoIndireto: emTextoMonetario(custos.custoIndireto),
      custoTotal: emTextoMonetario(custos.custoTotal),
      percentualSobrePreco: emTextoPercentual(taxas.percentualSobrePreco),
      valorTaxaPlataforma: emTextoMonetario(taxas.valorTaxaPlataforma),
      valorComissao: emTextoMonetario(taxas.valorComissao),
      taxasAdicionais: taxas.taxasAdicionais.map((taxa) => ({
        nome: taxa.nome,
        percentual: emTextoPercentual(taxa.percentual),
        valor: emTextoMonetario(taxa.valor),
      })),
      valorTaxasAdicionais: emTextoMonetario(taxas.valorTaxasAdicionais),
      lucroEstimado: emTextoMonetario(taxas.lucroEstimado),
      totalTaxasEMargem: emTextoMonetario(taxas.resultadoFinal.minus(custos.custoTotal)),
      resultadoFinal: emTextoMonetario(taxas.resultadoFinal),
      comparacao,
      versaoFormula: VERSAO_FORMULA,
    },
    avisos,
  };
}
