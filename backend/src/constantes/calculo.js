// Parametros do motor de calculo. A formula esta descrita na secao 5 do
// plano de implementacao e ainda depende de validacao com o stakeholder.

// Muda sempre que a regra do calculo mudar. Cada calculo salvo guarda a
// versao usada, para os relatorios antigos continuarem explicaveis.
export const VERSAO_FORMULA = '1';

// Maior valor que cabe numa coluna NUMERIC(14,2).
export const VALOR_MAXIMO = '999999999999.99';

export const PERCENTUAL_LIMITE = 100;
export const QUANTIDADE_MAXIMA = 1000000;
export const TAXAS_ADICIONAIS_MAXIMO = 10;
export const TAMANHO_MAXIMO_NOME_TAXA = 80;

// Acima disto o calculo nao e bloqueado, mas a tela mostra um aviso.
export const PERCENTUAL_AVISO = 60;

export const CASAS_DINHEIRO = 2;
export const CASAS_PERCENTUAL = 4;

// Nomes exibidos nas mensagens de validacao.
export const ROTULOS_CAMPOS = {
  orcamentoEmpresa: 'Orçamento da empresa',
  quantidadeItens: 'Quantidade de itens',
  custoFixo: 'Custo fixo',
  custoVariavel: 'Custo variável',
  seguro: 'Seguro da licitação',
  taxaPlataforma: 'Taxa da plataforma',
  comissaoTerceiros: 'Comissão de terceiros',
  margemLucro: 'Margem de lucro',
};
