// Limites da tela de calculo, alinhados com o back-end
// (backend/src/constantes/calculo.js). O servidor valida de novo.

// 12 digitos inteiros + 2 decimais = maior valor de NUMERIC(14,2).
export const DIGITOS_MAXIMOS_MOEDA = 14;
export const CASAS_PERCENTUAL = 4;
export const QUANTIDADE_MAXIMA = 1000000;
export const TAXAS_ADICIONAIS_MAXIMO = 10;

// Campos do formulario da Figura C1, guardados como texto no formato da tela.
export const CALCULO_VAZIO = {
  orcamentoEmpresa: '',
  quantidadeItens: '',
  custoFixo: '',
  custoVariavel: '',
  seguro: '',
  taxaPlataforma: '',
  comissaoTerceiros: '',
  margemLucro: '',
};

export const CAMPOS_MOEDA = ['orcamentoEmpresa', 'custoFixo', 'custoVariavel', 'seguro'];
export const CAMPOS_PERCENTUAL = ['taxaPlataforma', 'comissaoTerceiros', 'margemLucro'];

// Campos que precisam estar preenchidos (orcamento da empresa e seguro sao opcionais).
export const CAMPOS_OBRIGATORIOS = ['quantidadeItens', 'custoFixo', 'custoVariavel', 'taxaPlataforma', 'comissaoTerceiros', 'margemLucro'];

export const ROTULOS_CALCULO = {
  orcamentoEmpresa: 'Orçamento da empresa',
  quantidadeItens: 'Quantidade de itens',
  custoFixo: 'Custo fixo',
  custoVariavel: 'Custo variável (por item)',
  seguro: 'Seguro da licitação',
  taxaPlataforma: 'Taxa da plataforma',
  comissaoTerceiros: 'Comissão de terceiros',
  margemLucro: 'Margem de lucro',
};

// Quantas licitacoes o seletor da tela de calculo carrega de uma vez.
export const LIMITE_SELETOR_LICITACOES = 50;
