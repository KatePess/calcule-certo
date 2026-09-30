import { STATUS } from '../constantes/http.js';
import {
  DIGITOS_TELEFONE,
  FUNCIONARIOS_MAXIMO,
  PORTES_EMPRESA,
  ROTULOS_EMPRESA,
  TAMANHO_MAXIMO_EMPRESA,
  UFS,
} from '../constantes/empresa.js';
import { ERROS } from '../constantes/mensagens.js';
import { transacao } from '../db.js';
import { empresaRepositorio } from '../repositorios/empresaRepositorio.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { apenasDigitos, emailNormalizado, textoLimpo, textoOuNulo } from '../utils/formatadores.js';
import { ehCnpjValido, ehEmailValido } from '../utils/validadores.js';

function invalido(mensagem) {
  return new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

// Todos os campos sao opcionais; o que vier preenchido precisa estar certo.
function lerDados(dados) {
  const textos = {};
  for (const [campo, maximo] of Object.entries(TAMANHO_MAXIMO_EMPRESA)) {
    const texto = textoOuNulo(dados?.[campo]);
    if (texto && texto.length > maximo) throw invalido(ERROS.EMPRESA_TEXTO_LONGO(ROTULOS_EMPRESA[campo], maximo));
    textos[campo] = texto;
  }

  if (textos.emailCorporativo) {
    textos.emailCorporativo = emailNormalizado(textos.emailCorporativo);
    if (!ehEmailValido(textos.emailCorporativo)) throw invalido(ERROS.EMPRESA_EMAIL);
  }

  const cnpj = apenasDigitos(dados?.cnpj);
  if (!ehCnpjValido(cnpj)) throw invalido(ERROS.CNPJ_INVALIDO);

  const telefone = apenasDigitos(dados?.telefone);
  if (telefone && (telefone.length < DIGITOS_TELEFONE.MINIMO || telefone.length > DIGITOS_TELEFONE.MAXIMO)) {
    throw invalido(ERROS.EMPRESA_TELEFONE);
  }

  let funcionarios = null;
  const textoFuncionarios = textoLimpo(dados?.funcionarios);
  if (textoFuncionarios !== '') {
    if (!/^\d+$/.test(textoFuncionarios) || Number(textoFuncionarios) > FUNCIONARIOS_MAXIMO) {
      throw invalido(ERROS.EMPRESA_FUNCIONARIOS);
    }
    funcionarios = Number(textoFuncionarios);
  }

  const porte = textoOuNulo(dados?.porte);
  if (porte && !PORTES_EMPRESA.includes(porte)) throw invalido(ERROS.EMPRESA_PORTE);

  const uf = textoOuNulo(dados?.uf)?.toUpperCase() ?? null;
  if (uf && !UFS.includes(uf)) throw invalido(ERROS.EMPRESA_UF);

  return { ...textos, cnpj: cnpj || null, telefone: telefone || null, funcionarios, porte, uf };
}

// Texto vazio em vez de null: a tela usa os valores direto nos campos.
function empresaPublica(linha) {
  return {
    razaoSocial: linha.razao_social ?? '',
    nomeFantasia: linha.nome_fantasia ?? '',
    cnpj: linha.cnpj ?? '',
    inscricaoEstadual: linha.inscricao_estadual ?? '',
    emailCorporativo: linha.email_corporativo ?? '',
    telefone: linha.telefone ?? '',
    funcionarios: linha.funcionarios ?? null,
    porte: linha.porte ?? '',
    ramoAtividade: linha.ramo_atividade ?? '',
    cidade: linha.cidade ?? '',
    uf: linha.uf ?? '',
    atualizadoEm: linha.atualizado_em ?? null,
  };
}

export const empresaServico = {
  async obter(usuarioId) {
    const linha = await empresaRepositorio.buscar(usuarioId);
    if (!linha) throw new ErroDeAplicacao(ERROS.USUARIO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO);
    return empresaPublica(linha);
  },

  // O CNPJ fica na conta (usuarios) e o resto em empresas: os dois mudam
  // juntos, na mesma transacao.
  async salvar(usuarioId, dados) {
    const { cnpj, ...empresa } = lerDados(dados);
    await transacao(async (cliente) => {
      await usuarioRepositorio.atualizarCnpj(usuarioId, cnpj, cliente);
      await empresaRepositorio.salvar(usuarioId, empresa, cliente);
    });
    return this.obter(usuarioId);
  },
};
