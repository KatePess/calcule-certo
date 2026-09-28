import { ROTULOS_CAMPOS, TAMANHO_MAXIMO_NOME_TAXA, TAXAS_ADICIONAIS_MAXIMO } from '../constantes/calculo.js';
import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { transacao } from '../db.js';
import { calculoRepositorio } from '../repositorios/calculoRepositorio.js';
import { licitacaoRepositorio } from '../repositorios/licitacaoRepositorio.js';
import { relatorioRepositorio } from '../repositorios/relatorioRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { Dec, ZERO, emTextoMonetario, emTextoPercentual } from '../utils/dinheiro.js';
import { lerDinheiro, lerPercentual, lerTexto } from '../utils/entradaNumerica.js';
import { textoLimpo } from '../utils/formatadores.js';
import { calcular, compararComOrcamento } from './motorCalculo.js';

const FORMATO_QUANTIDADE = /^\d{1,7}$/;

function invalido(mensagem) {
  return new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

function lerQuantidade(valor) {
  const texto = lerTexto(valor);
  if (!FORMATO_QUANTIDADE.test(texto)) throw invalido(ERROS.CALCULO_QUANTIDADE);
  return Number(texto);
}

function lerTaxasAdicionais(lista) {
  if (lista === undefined || lista === null) return [];
  if (!Array.isArray(lista) || lista.length > TAXAS_ADICIONAIS_MAXIMO) throw invalido(ERROS.CALCULO_TAXAS_ADICIONAIS);

  return lista.map((taxa) => {
    const nome = textoLimpo(taxa?.nome);
    if (!nome || nome.length > TAMANHO_MAXIMO_NOME_TAXA) throw invalido(ERROS.CALCULO_NOME_TAXA);
    return { nome, percentual: lerPercentual(taxa?.percentual, nome) };
  });
}

// Converte o corpo da requisicao nas entradas do motor. Aqui se confere o
// FORMATO; as regras (soma < 100%, custo > 0...) ficam no motor.
export function lerEntrada(dados) {
  return {
    orcamentoEmpresa: lerDinheiro(dados?.orcamentoEmpresa, ROTULOS_CAMPOS.orcamentoEmpresa, { obrigatorio: false }),
    quantidadeItens: lerQuantidade(dados?.quantidadeItens),
    custoFixo: lerDinheiro(dados?.custoFixo, ROTULOS_CAMPOS.custoFixo),
    custoVariavel: lerDinheiro(dados?.custoVariavel, ROTULOS_CAMPOS.custoVariavel),
    seguro: lerDinheiro(dados?.seguro, ROTULOS_CAMPOS.seguro, { obrigatorio: false }) ?? ZERO,
    taxaPlataforma: lerPercentual(dados?.taxaPlataforma, ROTULOS_CAMPOS.taxaPlataforma),
    comissaoTerceiros: lerPercentual(dados?.comissaoTerceiros, ROTULOS_CAMPOS.comissaoTerceiros),
    margemLucro: lerPercentual(dados?.margemLucro, ROTULOS_CAMPOS.margemLucro),
    taxasAdicionais: lerTaxasAdicionais(dados?.taxasAdicionais),
  };
}

// Monta o calculo salvo no formato da API. O resultado vem do que foi
// gravado, e nao de um novo calculo: assim o relatorio mostra exatamente o
// que foi gerado na epoca, mesmo que a formula mude depois.
export function calculoPublico(linha) {
  const taxasAdicionais = linha.taxas_adicionais ?? [];
  const orcamentoEmpresa = linha.orcamento_empresa === null ? null : new Dec(linha.orcamento_empresa);
  const custoTotal = new Dec(linha.custo_total);
  const resultadoFinal = new Dec(linha.resultado_final);
  const percentualSobrePreco = [linha.taxa_plataforma, linha.comissao_terceiros, linha.margem_lucro, ...taxasAdicionais.map((t) => t.percentual)]
    .reduce((soma, valor) => soma.plus(valor), ZERO);

  return {
    id: linha.id,
    criadoEm: linha.criado_em,
    licitacao: {
      id: linha.licitacao_id,
      numero: linha.licitacao_numero,
      orgao: linha.licitacao_orgao,
      objeto: linha.licitacao_objeto,
    },
    entradas: {
      orcamentoEmpresa: orcamentoEmpresa ? emTextoMonetario(orcamentoEmpresa) : null,
      quantidadeItens: linha.quantidade_itens,
      custoFixo: linha.custo_fixo,
      custoVariavel: linha.custo_variavel,
      seguro: linha.seguro,
      taxaPlataforma: emTextoPercentual(linha.taxa_plataforma),
      comissaoTerceiros: emTextoPercentual(linha.comissao_terceiros),
      margemLucro: emTextoPercentual(linha.margem_lucro),
      taxasAdicionais: taxasAdicionais.map(({ nome, percentual }) => ({ nome, percentual })),
    },
    resultado: {
      custoDireto: linha.custo_direto,
      custoIndireto: linha.custo_indireto,
      custoTotal: linha.custo_total,
      percentualSobrePreco: emTextoPercentual(percentualSobrePreco),
      valorTaxaPlataforma: linha.valor_taxa_plataforma,
      valorComissao: linha.valor_comissao,
      taxasAdicionais,
      valorTaxasAdicionais: linha.valor_taxas_adicionais,
      lucroEstimado: linha.lucro_estimado,
      totalTaxasEMargem: emTextoMonetario(resultadoFinal.minus(custoTotal)),
      resultadoFinal: linha.resultado_final,
      comparacao: compararComOrcamento({
        orcamentoEmpresa,
        taxaPlataforma: new Dec(linha.taxa_plataforma),
        comissaoTerceiros: new Dec(linha.comissao_terceiros),
        taxasAdicionais: taxasAdicionais.map((t) => ({ percentual: new Dec(t.percentual) })),
        custoTotal,
        resultadoFinal,
      }),
      versaoFormula: linha.versao_formula,
    },
  };
}

export const calculoServico = {
  // Calcula sem gravar nada: alimenta o modal de resumo (Figura C2).
  simular(dados) {
    return calcular(lerEntrada(dados));
  },

  // Recalcula no servidor e grava calculo + relatorio juntos. Qualquer
  // "resultado" enviado pelo navegador e ignorado.
  async salvar(usuarioId, dados) {
    const licitacaoId = Number(dados?.licitacaoId);
    if (!Number.isSafeInteger(licitacaoId) || licitacaoId <= 0) throw invalido(ERROS.CALCULO_LICITACAO_OBRIGATORIA);

    const licitacao = await licitacaoRepositorio.buscarPorId(licitacaoId, usuarioId);
    if (!licitacao) throw new ErroDeAplicacao(ERROS.LICITACAO_NAO_ENCONTRADA, STATUS.NAO_ENCONTRADO);

    const entrada = lerEntrada(dados);
    const { resultado, avisos } = calcular(entrada);

    const { calculoId, relatorioId } = await transacao(async (cliente) => {
      const id = await calculoRepositorio.inserir({ usuarioId, licitacaoId, entrada, resultado }, cliente);
      const relatorio = await relatorioRepositorio.inserir(id, cliente);
      await licitacaoRepositorio.registrarAtividade(licitacaoId, cliente);
      return { calculoId: id, relatorioId: relatorio.id };
    });

    return { calculo: await this.obter(usuarioId, calculoId), relatorioId, avisos };
  },

  async obter(usuarioId, id) {
    const linha = await calculoRepositorio.buscarPorId(id, usuarioId);
    if (!linha) throw new ErroDeAplicacao(ERROS.CALCULO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO);
    return calculoPublico(linha);
  },
};
