// Geracao do relatorio em PDF (classe RelatorioPDF do diagrama), feita no
// servidor com o pdfmake, sem precisar de navegador instalado.
import { createRequire } from 'node:module';
import path from 'node:path';
import pdfmake from 'pdfmake';
import { AMBIENTE } from '../config/ambiente.js';
import {
  formatarCnpjBR,
  formatarDataHoraBR,
  formatarMoedaBR,
  formatarPercentualBR,
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
  cinza: '#4A5768',
  linha: '#D8DAE0',
  fundo: '#EEF4FD',
  verde: '#1A9A3F',
  vermelho: '#C0392B',
};

function tabelaDuasColunas(linhas, { destaqueUltima = false } = {}) {
  return {
    table: {
      widths: ['*', 'auto'],
      body: linhas.map(([rotulo, valor], indice) => {
        const destaque = destaqueUltima && indice === linhas.length - 1;
        return [
          { text: rotulo, bold: destaque, margin: [4, 4, 4, 4] },
          { text: valor, bold: destaque, alignment: 'right', margin: [4, 4, 4, 4] },
        ];
      }),
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0,
      hLineColor: () => COR.linha,
      fillColor: (linha) => (destaqueUltima && linha === linhas.length - 1 ? COR.fundo : null),
    },
    margin: [0, 0, 0, 14],
  };
}

function titulo(texto) {
  return { text: texto, style: 'secao' };
}

// Monta a definicao do documento a partir do calculo salvo. Recebe dados ja
// prontos (calculoPublico + usuario), sem acessar o banco.
export function gerarEstruturaPDF({ calculo, usuario, geradoEm }) {
  const { entradas, resultado, licitacao } = calculo;
  const fuso = AMBIENTE.FUSO_HORARIO;

  const parametros = [
    ['Quantidade de itens', String(entradas.quantidadeItens)],
    ['Custo variável por item', formatarMoedaBR(entradas.custoVariavel)],
    ['Custo fixo', formatarMoedaBR(entradas.custoFixo)],
    ['Seguro da licitação', formatarMoedaBR(entradas.seguro)],
    ['Taxa da plataforma', formatarPercentualBR(entradas.taxaPlataforma)],
    ['Comissão de terceiros', formatarPercentualBR(entradas.comissaoTerceiros)],
    ...entradas.taxasAdicionais.map((taxa) => [taxa.nome, formatarPercentualBR(taxa.percentual)]),
    ['Margem de lucro desejada', formatarPercentualBR(entradas.margemLucro)],
  ];
  if (entradas.orcamentoEmpresa) parametros.unshift(['Orçamento atual da empresa', formatarMoedaBR(entradas.orcamentoEmpresa)]);

  const composicao = [
    [`Custo direto (${formatarMoedaBR(entradas.custoVariavel)} × ${entradas.quantidadeItens} itens)`, formatarMoedaBR(resultado.custoDireto)],
    ['Custo indireto (custo fixo + seguro)', formatarMoedaBR(resultado.custoIndireto)],
    ['Custo total', formatarMoedaBR(resultado.custoTotal)],
    [`Taxa da plataforma (${formatarPercentualBR(entradas.taxaPlataforma)})`, formatarMoedaBR(resultado.valorTaxaPlataforma)],
    [`Comissão de terceiros (${formatarPercentualBR(entradas.comissaoTerceiros)})`, formatarMoedaBR(resultado.valorComissao)],
    ...resultado.taxasAdicionais.map((taxa) => [`${taxa.nome} (${formatarPercentualBR(taxa.percentual)})`, formatarMoedaBR(taxa.valor)]),
    [`Lucro estimado (${formatarPercentualBR(entradas.margemLucro)} do preço)`, formatarMoedaBR(resultado.lucroEstimado)],
    ['Novo orçamento', formatarMoedaBR(resultado.resultadoFinal)],
  ];

  const conteudo = [
    {
      columns: [
        { text: [{ text: 'Calcule ', color: COR.marinho }, { text: 'Certo', color: COR.azul }], fontSize: 20, bold: true },
        { text: `Gerado em ${formatarDataHoraBR(geradoEm, fuso)}`, alignment: 'right', color: COR.cinza, fontSize: 9, margin: [0, 8, 0, 0] },
      ],
    },
    { text: 'Relatório de cálculo de licitação', fontSize: 13, color: COR.cinza, margin: [0, 2, 0, 12] },
    { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1.5, lineColor: COR.azul }], margin: [0, 0, 0, 14] },

    titulo('Identificação'),
    tabelaDuasColunas([
      ['Responsável', usuario.nome],
      ['CNPJ', usuario.cnpj ? formatarCnpjBR(usuario.cnpj) : 'Não informado'],
      ['Licitação', `${licitacao.numero} · ${licitacao.orgao}`],
      ...(licitacao.objeto ? [['Objeto', licitacao.objeto]] : []),
      ['Data do cálculo', formatarDataHoraBR(calculo.criadoEm, fuso)],
    ]),

    {
      table: {
        widths: ['*'],
        body: [[{
          stack: [
            { text: 'Novo orçamento gerado', color: COR.cinza, fontSize: 10 },
            { text: formatarMoedaBR(resultado.resultadoFinal), fontSize: 22, bold: true, color: COR.verde },
            {
              text: `Lucro estimado de ${formatarMoedaBR(resultado.lucroEstimado)} · custos totais de ${formatarMoedaBR(resultado.custoTotal)}`,
              color: COR.cinza,
              fontSize: 9,
            },
          ],
          alignment: 'center',
          fillColor: COR.fundo,
          margin: [0, 10, 0, 10],
        }]],
      },
      layout: 'noBorders',
      margin: [0, 0, 0, 16],
    },

    titulo('Parâmetros informados'),
    tabelaDuasColunas(parametros),

    titulo('Composição do novo orçamento'),
    tabelaDuasColunas(composicao, { destaqueUltima: true }),
  ];

  if (resultado.comparacao) {
    const { orcamentoEmpresa, lucroComOrcamentoAtual, diferenca } = resultado.comparacao;
    const prejuizo = String(lucroComOrcamentoAtual).startsWith('-');
    conteudo.push(
      titulo('Comparação com o orçamento atual'),
      {
        text: [
          `Mantendo o orçamento de ${formatarMoedaBR(orcamentoEmpresa)}, a empresa teria `,
          {
            text: `${prejuizo ? 'prejuízo' : 'lucro'} de ${formatarMoedaBR(String(lucroComOrcamentoAtual).replace(/^-/, ''))}`,
            bold: true,
            color: prejuizo ? COR.vermelho : COR.verde,
          },
          `. O novo orçamento é ${formatarMoedaBR(String(diferenca).replace(/^-/, ''))} ${String(diferenca).startsWith('-') ? 'menor' : 'maior'}.`,
        ],
        margin: [0, 0, 0, 14],
      },
    );
  }

  conteudo.push({
    text:
      `Como o valor foi calculado: taxa da plataforma, comissão e margem são cobradas sobre o preço final e somam ` +
      `${formatarPercentualBR(resultado.percentualSobrePreco)} dele. Por isso o novo orçamento é o custo total dividido pela ` +
      `parte do preço que sobra depois delas. Fórmula de cálculo: versão ${resultado.versaoFormula}.`,
    fontSize: 8.5,
    color: COR.cinza,
    margin: [0, 6, 0, 0],
  });

  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 50],
    info: {
      title: `Cálculo da licitação ${licitacao.numero}`,
      author: usuario.nome,
      creator: 'Calcule Certo',
    },
    defaultStyle: { font: 'Roboto', fontSize: 10, color: COR.marinho },
    styles: { secao: { fontSize: 11, bold: true, color: COR.azul, margin: [0, 4, 0, 6] } },
    content: conteudo,
    footer: (paginaAtual, totalPaginas) => ({
      columns: [
        { text: 'Calcule Certo', color: COR.cinza, fontSize: 8 },
        { text: `Página ${paginaAtual} de ${totalPaginas}`, alignment: 'right', color: COR.cinza, fontSize: 8 },
      ],
      margin: [40, 16, 40, 0],
    }),
  };
}

export async function gerarPdf(dados) {
  return pdfmake.createPdf(gerarEstruturaPDF(dados)).getBuffer();
}
