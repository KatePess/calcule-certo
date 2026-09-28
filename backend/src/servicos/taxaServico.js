import { PERCENTUAL_LIMITE, TAMANHO_MAXIMO_NOME_TAXA } from '../constantes/calculo.js';
import { CODIGO_PG_DUPLICADO, STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { LISTA_TIPOS_TAXA, TAXAS_SALVAS_MAXIMO } from '../constantes/taxa.js';
import { taxaRepositorio } from '../repositorios/taxaRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { emTextoPercentual } from '../utils/dinheiro.js';
import { lerPercentual } from '../utils/entradaNumerica.js';
import { textoLimpo } from '../utils/formatadores.js';

const ROTULO_PERCENTUAL = 'Percentual';

function invalido(mensagem) {
  return new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

function lerDados(dados) {
  const nome = textoLimpo(dados?.nome);
  if (!nome || nome.length > TAMANHO_MAXIMO_NOME_TAXA) throw invalido(ERROS.TAXA_NOME);

  const percentual = lerPercentual(dados?.percentual, ROTULO_PERCENTUAL);
  if (percentual.greaterThanOrEqualTo(PERCENTUAL_LIMITE)) throw invalido(ERROS.CALCULO_PERCENTUAL_FORA(ROTULO_PERCENTUAL));

  const tipo = textoLimpo(dados?.tipo);
  if (!LISTA_TIPOS_TAXA.includes(tipo)) throw invalido(ERROS.TAXA_TIPO_INVALIDO);

  return { nome, percentual: percentual.toString(), tipo };
}

function tratarDuplicidade(erro) {
  if (erro.code === CODIGO_PG_DUPLICADO) throw new ErroDeAplicacao(ERROS.TAXA_DUPLICADA, STATUS.CONFLITO);
  throw erro;
}

export function taxaPublica(linha) {
  return {
    id: linha.id,
    nome: linha.nome,
    percentual: emTextoPercentual(linha.percentual),
    tipo: linha.tipo,
    criadoEm: linha.criado_em,
  };
}

// Classe TaxaCustomizada do diagrama: salvarTaxa() e atualizarTaxa().
export const taxaServico = {
  async listar(usuarioId) {
    return (await taxaRepositorio.listar(usuarioId)).map(taxaPublica);
  },

  async salvarTaxa(usuarioId, dados) {
    const campos = lerDados(dados);
    if ((await taxaRepositorio.contar(usuarioId)) >= TAXAS_SALVAS_MAXIMO) {
      throw new ErroDeAplicacao(ERROS.TAXA_LIMITE, STATUS.CONFLITO);
    }
    try {
      return taxaPublica(await taxaRepositorio.inserir({ usuarioId, ...campos }));
    } catch (erro) {
      return tratarDuplicidade(erro);
    }
  },

  async atualizarTaxa(usuarioId, id, dados) {
    const campos = lerDados(dados);
    let linha;
    try {
      linha = await taxaRepositorio.atualizar(id, usuarioId, campos);
    } catch (erro) {
      return tratarDuplicidade(erro);
    }
    if (!linha) throw new ErroDeAplicacao(ERROS.TAXA_NAO_ENCONTRADA, STATUS.NAO_ENCONTRADO);
    return taxaPublica(linha);
  },

  async excluir(usuarioId, id) {
    if (!(await taxaRepositorio.excluir(id, usuarioId))) {
      throw new ErroDeAplicacao(ERROS.TAXA_NAO_ENCONTRADA, STATUS.NAO_ENCONTRADO);
    }
  },
};
