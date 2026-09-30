// Regras dos dados da empresa. Os portes precisam bater com o CHECK da tabela
// empresas e com frontend/src/constantes/empresa.js.
export const PORTES_EMPRESA = ['MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE'];

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

// Tamanho maximo de cada campo de texto (o mesmo das colunas).
export const TAMANHO_MAXIMO_EMPRESA = {
  razaoSocial: 150,
  nomeFantasia: 150,
  inscricaoEstadual: 20,
  emailCorporativo: 150,
  ramoAtividade: 120,
  cidade: 100,
};

export const ROTULOS_EMPRESA = {
  razaoSocial: 'Razão social',
  nomeFantasia: 'Nome fantasia',
  inscricaoEstadual: 'Inscrição estadual',
  emailCorporativo: 'E-mail corporativo',
  ramoAtividade: 'Ramo de atividade',
  cidade: 'Cidade',
};

// Telefone com DDD: fixo tem 10 digitos, celular 11.
export const DIGITOS_TELEFONE = { MINIMO: 10, MAXIMO: 11 };

export const FUNCIONARIOS_MAXIMO = 1_000_000;
