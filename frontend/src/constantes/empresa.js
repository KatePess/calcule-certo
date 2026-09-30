// Dados da empresa em "Meu perfil". Os valores de porte precisam bater com
// backend/src/constantes/empresa.js.
export const OPCOES_PORTE = [
  { valor: 'MEI', rotulo: 'Microempreendedor individual (MEI)' },
  { valor: 'ME', rotulo: 'Microempresa (ME)' },
  { valor: 'EPP', rotulo: 'Empresa de pequeno porte (EPP)' },
  { valor: 'MEDIO', rotulo: 'Média empresa' },
  { valor: 'GRANDE', rotulo: 'Grande empresa' },
];

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

// Iguais as colunas da tabela empresas.
export const TAMANHO_MAXIMO_EMPRESA = {
  razaoSocial: 150,
  nomeFantasia: 150,
  inscricaoEstadual: 20,
  emailCorporativo: 150,
  ramoAtividade: 120,
  cidade: 100,
};

export const EMPRESA_VAZIA = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  inscricaoEstadual: '',
  emailCorporativo: '',
  telefone: '',
  funcionarios: '',
  porte: '',
  ramoAtividade: '',
  cidade: '',
  uf: '',
};
