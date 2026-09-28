// Status da licitacao. Os codigos devem bater com os do back-end
// (backend/src/constantes/licitacao.js); aqui ficam o texto e o visual.
export const STATUS_LICITACAO = {
  EDITAL_ABERTO: { rotulo: 'Edital aberto', tom: 'alerta', icone: 'exclamacao' },
  EM_ANDAMENTO: { rotulo: 'Em andamento', tom: 'info', icone: 'andamento' },
  AGUARDANDO_APROVACAO: { rotulo: 'Aguardando aprovação', tom: 'espera', icone: 'relogio' },
  APROVADO: { rotulo: 'Aprovado', tom: 'sucesso', icone: 'check' },
  REPROVADO: { rotulo: 'Reprovado', tom: 'erro', icone: 'fechar' },
};

export const OPCOES_STATUS = Object.entries(STATUS_LICITACAO).map(([valor, { rotulo }]) => ({ valor, rotulo }));

export const STATUS_INICIAL = 'EDITAL_ABERTO';

// Iguais aos limites do back-end.
export const TAMANHO_MAXIMO_LICITACAO = {
  NUMERO: 30,
  ORGAO: 120,
  OBJETO: 255,
};

export const LICITACAO_VAZIA = {
  numero: '',
  orgao: '',
  objeto: '',
  dataAbertura: '',
  status: STATUS_INICIAL,
};
