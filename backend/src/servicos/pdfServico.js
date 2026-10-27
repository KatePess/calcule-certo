// Geracao do PDF (classe RelatorioPDF do diagrama), feita no servidor com o
// pdfmake, sem precisar de navegador instalado. O documento e a proposta de
// preco pronta para enviar ao orgao: mostra so o que o cliente precisa ver
// (empresa, licitacao, itens, valor e condicoes). Custos, taxas e margem sao
// informacao interna e ficam na tela "Resumo do calculo" do sistema.
import { createRequire } from 'node:module';
import path from 'node:path';
import pdfmake from 'pdfmake';
import { AMBIENTE } from '../config/ambiente.js';
import { VALIDADE_PROPOSTA_DIAS } from '../constantes/proposta.js';
import { Dec, emTextoMonetario } from '../utils/dinheiro.js';
import { valorPorExtenso } from '../utils/extenso.js';
import {
  formatarCnpjBR,
  formatarDataBR,
  formatarDataExtensoBR,
  formatarMoedaBR,
  formatarTelefoneBR,
} from '../utils/formatadores.js';

// Fontes Roboto que acompanham o pdfmake; elas tem todos os acentos.
const PASTA_FONTES = path.join(
  path.dirname(createRequire(import.meta.url).resolve('pdfmake/package.json')),
  'fonts',
  'Roboto',
);

pdfmake.setFonts({
  Roboto: {
    normal: path.join(PASTA_FONTES, 'Roboto-Regular.ttf'),
    bold: path.join(PASTA_FONTES, 'Roboto-Medium.ttf'),
    italics: path.join(PASTA_FONTES, 'Roboto-Italic.ttf'),
    bolditalics: path.join(PASTA_FONTES, 'Roboto-MediumItalic.ttf'),
  },
});

// O PDF contem textos digitados pelo usuario. Por seguranca, o gerador nao
// pode baixar nada da internet nem ler arquivos alem das fontes.
pdfmake.setUrlAccessPolicy(() => false);
pdfmake.setLocalAccessPolicy((caminho) => path.resolve(caminho).startsWith(PASTA_FONTES));

const COR = {
  marinho: '#0F2A4A',
  azul: '#2F7BFF',
  texto: '#1F2D3D',
  cinza: '#5B6878',
  cinzaClaro: '#8A96A5',
  linha: '#DCE3EC',
  fundo: '#F2F6FC',
  fundoDestaque: '#E8F0FD',
};

const MARGEM_LATERAL = 50;
const LARGURA_UTIL = 595.28 - MARGEM_LATERAL * 2; // A4 tem 595,28 pt de largura
const UM_DIA_MS = 24 * 60 * 60 * 1000;

function linhaHorizontal(cor = COR.linha, espessura = 0.75) {
  return { canvas: [{ type: 'line', x1: 0, y1: 0, x2: LARGURA_UTIL, y2: 0, lineWidth: espessura, lineColor: cor }] };
}

// Rotulo pequeno em caixa alta, acima de cada informacao.
function rotulo(texto) {
  return { text: texto.toUpperCase(), fontSize: 7.5, bold: true, color: COR.cinzaClaro, characterSpacing: 0.6, margin: [0, 0, 0, 2] };
}

function tituloSecao(texto) {
  return { text: texto, fontSize: 11, bold: true, color: COR.marinho, margin: [0, 18, 0, 8] };
}

// Cabecalho: quem emite a proposta a esquerda, numero e data a direita.
function cabecalho({ empresa, numeroProposta, geradoEm, fuso }) {
  const contato = [
    empresa.cidade && empresa.uf ? `${empresa.cidade}/${empresa.uf}` : empresa.cidade,
    empresa.telefone && formatarTelefoneBR(empresa.telefone),
    empresa.email,
  ].filter(Boolean);
  const documentos = [
    empresa.cnpj && `CNPJ ${formatarCnpjBR(empresa.cnpj)}`,
    empresa.inscricaoEstadual && `IE ${empresa.inscricaoEstadual}`,
  ].filter(Boolean);

  return {
    columns: [
      {
        width: '*',
        stack: [
          { text: empresa.nome, fontSize: 15, bold: true, color: COR.marinho },
          ...(empresa.nomeFantasia ? [{ text: empresa.nomeFantasia, fontSize: 9.5, color: COR.cinza, margin: [0, 1, 0, 0] }] : []),
          ...(documentos.length ? [{ text: documentos.join('   ·   '), fontSize: 8.5, color: COR.cinza, margin: [0, 6, 0, 0] }] : []),
          ...(contato.length ? [{ text: contato.join('   ·   '), fontSize: 8.5, color: COR.cinza, margin: [0, 2, 0, 0] }] : []),
        ],
      },
      {
        width: 150,
        table: {
          widths: ['*'],
          body: [[{
            stack: [
              { text: 'PROPOSTA COMERCIAL', fontSize: 9, bold: true, color: COR.azul, characterSpacing: 0.8 },
              { text: `Nº ${numeroProposta}`, fontSize: 14, bold: true, color: COR.marinho, margin: [0, 3, 0, 0] },
              { text: `Emitida em ${formatarDataBR(geradoEm, fuso)}`, fontSize: 8.5, color: COR.cinza, margin: [0, 3, 0, 0] },
            ],
            alignment: 'right',
            margin: [10, 8, 10, 8],
          }]],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: (i) => (i === 1 ? 3 : 0),
          vLineColor: () => COR.azul,
          fillColor: () => COR.fundo,
        },
      },
    ],
    columnGap: 20,
  };
}

// Orgao, numero da licitacao e objeto, em duas colunas.
function dadosDaLicitacao(licitacao) {
  const bloco = (titulo, valor) => ({ stack: [rotulo(titulo), { text: valor, fontSize: 10.5, color: COR.texto }] });
  return {
    table: {
      widths: ['*', 'auto'],
      body: [
        [bloco('Destinatário', licitacao.orgao), bloco('Licitação nº', licitacao.numero)],
        ...(licitacao.objeto ? [[{ ...bloco('Objeto', licitacao.objeto), colSpan: 2 }, {}]] : []),
      ],
    },
    layout: {
      hLineWidth: (i, no) => (i === 0 || i === no.table.body.length ? 0 : 0.75),
      vLineWidth: () => 0,
      hLineColor: () => COR.linha,
      paddingLeft: () => 0,
      paddingRight: (i) => (i === 0 ? 24 : 0),
      paddingTop: () => 8,
      paddingBottom: () => 8,
    },
  };
}

// Tabela de itens. O valor total e o calculado pelo sistema; o unitario e o
// total dividido pela quantidade, arredondado em centavos.
function tabelaDeItens({ licitacao, quantidade, valorUnitario, valorTotal, unitarioArredondado }) {
  const cabecalhoCelula = (texto, alignment = 'left') => ({
    text: texto, bold: true, fontSize: 8.5, color: '#FFFFFF', alignment, characterSpacing: 0.3,
  });
  const descricao = licitacao.objeto || `Fornecimento referente à licitação nº ${licitacao.numero}`;

  return [
    {
      table: {
        headerRows: 1,
        widths: [28, '*', 44, 86, 92],
        body: [
          [
            cabecalhoCelula('ITEM', 'center'),
            cabecalhoCelula('DESCRIÇÃO'),
            cabecalhoCelula('QTD.', 'center'),
            cabecalhoCelula('VALOR UNIT.', 'right'),
            cabecalhoCelula('VALOR TOTAL', 'right'),
          ],
          [
            { text: '1', alignment: 'center' },
            { text: descricao },
            { text: quantidade.toLocaleString('pt-BR'), alignment: 'center' },
            { text: `${formatarMoedaBR(valorUnitario)}${unitarioArredondado ? '*' : ''}`, alignment: 'right', noWrap: true },
            { text: formatarMoedaBR(valorTotal), alignment: 'right', bold: true, noWrap: true },
          ],
        ],
      },
      layout: {
        fillColor: (linha) => (linha === 0 ? COR.marinho : null),
        hLineWidth: (i, no) => (i === no.table.body.length ? 0.75 : 0),
        vLineWidth: () => 0,
        hLineColor: () => COR.linha,
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: (linha) => (linha === 0 ? 7 : 10),
        paddingBottom: (linha) => (linha === 0 ? 7 : 10),
      },
      fontSize: 9.5,
      color: COR.texto,
    },
    ...(unitarioArredondado
      ? [{
        text: '* Valor unitário arredondado para duas casas decimais. Prevalece o valor total da proposta.',
        fontSize: 7.5, color: COR.cinzaClaro, margin: [0, 4, 0, 0],
      }]
      : []),
  ];
}

// Faixa com o valor global em destaque e por extenso.
function valorGlobal(valorTotal) {
  return {
    table: {
      widths: ['*', 'auto'],
      body: [[
        {
          stack: [
            { text: 'VALOR GLOBAL DA PROPOSTA', fontSize: 8.5, bold: true, color: COR.azul, characterSpacing: 0.6 },
            { text: `(${valorPorExtenso(valorTotal)})`, fontSize: 9, italics: true, color: COR.cinza, margin: [0, 4, 0, 0] },
          ],
          margin: [14, 12, 0, 12],
        },
        {
          text: formatarMoedaBR(valorTotal),
          fontSize: 20,
          bold: true,
          color: COR.marinho,
          alignment: 'right',
          noWrap: true,
          margin: [10, 13, 14, 0],
        },
      ]],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: (i) => (i === 0 ? 3 : 0),
      vLineColor: () => COR.azul,
      fillColor: () => COR.fundoDestaque,
    },
    margin: [0, 14, 0, 0],
  };
}

function condicoes({ geradoEm, fuso }) {
  const validaAte = new Date(new Date(geradoEm).getTime() + VALIDADE_PROPOSTA_DIAS * UM_DIA_MS);
  return [
    tituloSecao('Condições da proposta'),
    {
      ul: [
        { text: [{ text: 'Validade: ', bold: true }, `${VALIDADE_PROPOSTA_DIAS} dias a contar da data de emissão (até ${formatarDataBR(validaAte, fuso)}).`] },
        { text: [{ text: 'Composição do preço: ', bold: true }, 'estão incluídos todos os custos diretos e indiretos, tributos, encargos, taxas, seguros e demais despesas necessárias à execução do objeto.'] },
        { text: [{ text: 'Edital: ', bold: true }, 'declaramos estar de acordo com todas as condições estabelecidas no edital da licitação.'] },
      ],
      fontSize: 9,
      color: COR.texto,
      lineHeight: 1.25,
      markerColor: COR.azul,
    },
  ];
}

// Local, data e linha para assinatura de quem responde pela proposta.
function assinatura({ empresa, responsavel, geradoEm, fuso }) {
  const local = empresa.cidade && empresa.uf ? `${empresa.cidade}/${empresa.uf}, ` : '';
  return {
    unbreakable: true,
    stack: [
      { text: `${local}${formatarDataExtensoBR(geradoEm, fuso)}.`, fontSize: 9.5, color: COR.texto, margin: [0, 26, 0, 46] },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 240,
            stack: [
              { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 240, y2: 0, lineWidth: 0.75, lineColor: COR.marinho }] },
              { text: responsavel, bold: true, fontSize: 10, color: COR.marinho, margin: [0, 6, 0, 0] },
              { text: empresa.nome, fontSize: 8.5, color: COR.cinza, margin: [0, 2, 0, 0] },
              ...(empresa.cnpj ? [{ text: `CNPJ ${formatarCnpjBR(empresa.cnpj)}`, fontSize: 8.5, color: COR.cinza }] : []),
            ],
            alignment: 'center',
          },
          { width: '*', text: '' },
        ],
      },
    ],
  };
}

// Junta o que veio do cadastro da empresa; sem razao social, usa o nome de
// quem esta logado, para a proposta nunca sair sem emitente.
function emitente(usuario, empresa) {
  return {
    nome: empresa?.razao_social || empresa?.nome_fantasia || usuario.nome,
    nomeFantasia: empresa?.razao_social && empresa?.nome_fantasia ? empresa.nome_fantasia : null,
    cnpj: empresa?.cnpj || usuario.cnpj,
    inscricaoEstadual: empresa?.inscricao_estadual,
    cidade: empresa?.cidade,
    uf: empresa?.uf,
    telefone: empresa?.telefone,
    email: empresa?.email_corporativo,
  };
}

// Monta a definicao do documento a partir do calculo salvo. Recebe dados ja
// prontos (calculoPublico, usuario e a linha de empresaRepositorio), sem
// acessar o banco.
export function gerarEstruturaPDF({ calculo, usuario, empresa, numeroProposta, geradoEm, fuso = AMBIENTE.FUSO_HORARIO }) {
  const { entradas, resultado, licitacao } = calculo;
  const dadosEmpresa = emitente(usuario, empresa);

  const quantidade = Number(entradas.quantidadeItens);
  const valorTotal = resultado.resultadoFinal;
  const valorUnitario = emTextoMonetario(new Dec(valorTotal).dividedBy(quantidade));
  const unitarioArredondado = !new Dec(valorUnitario).times(quantidade).equals(valorTotal);

  const conteudo = [
    cabecalho({ empresa: dadosEmpresa, numeroProposta, geradoEm, fuso }),
    { ...linhaHorizontal(COR.marinho, 1.5), margin: [0, 14, 0, 0] },

    dadosDaLicitacao(licitacao),

    {
      text: 'Apresentamos nossa proposta de preço para o objeto abaixo, conforme as condições do edital.',
      fontSize: 9.5,
      color: COR.cinza,
      margin: [0, 12, 0, 0],
    },

    tituloSecao('Itens da proposta'),
    ...tabelaDeItens({ licitacao, quantidade, valorUnitario, valorTotal, unitarioArredondado }),
    valorGlobal(valorTotal),

    ...condicoes({ geradoEm, fuso }),
    assinatura({ empresa: dadosEmpresa, responsavel: usuario.nome, geradoEm, fuso }),
  ];

  return {
    pageSize: 'A4',
    pageMargins: [MARGEM_LATERAL, 44, MARGEM_LATERAL, 56],
    info: {
      title: `Proposta comercial ${numeroProposta} - Licitação ${licitacao.numero}`,
      author: dadosEmpresa.nome,
      creator: 'Calcule Certo',
    },
    defaultStyle: { font: 'Roboto', fontSize: 10, color: COR.texto },
    content: conteudo,
    footer: (paginaAtual, totalPaginas) => ({
      stack: [
        linhaHorizontal(),
        {
          columns: [
            { text: `Proposta nº ${numeroProposta}  ·  Licitação nº ${licitacao.numero}  ·  ${licitacao.orgao}`, color: COR.cinzaClaro, fontSize: 7.5 },
            { text: `Página ${paginaAtual} de ${totalPaginas}`, alignment: 'right', color: COR.cinzaClaro, fontSize: 7.5, width: 80 },
          ],
          margin: [0, 6, 0, 0],
        },
      ],
      margin: [MARGEM_LATERAL, 18, MARGEM_LATERAL, 0],
    }),
  };
}

export async function gerarPdf(dados) {
  return pdfmake.createPdf(gerarEstruturaPDF(dados)).getBuffer();
}
