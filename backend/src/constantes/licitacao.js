// Situacoes possiveis de uma licitacao. Os quatro primeiros aparecem nos
// prototipos; REPROVADO completa o ciclo. Devem bater com o CHECK da tabela.
export const STATUS_LICITACAO = {
  EDITAL_ABERTO: 'EDITAL_ABERTO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  AGUARDANDO_APROVACAO: 'AGUARDANDO_APROVACAO',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
};

export const LISTA_STATUS_LICITACAO = Object.values(STATUS_LICITACAO);

// Licitacoes nestes status nao geram mais alertas de prazo.
export const STATUS_ENCERRADOS = [STATUS_LICITACAO.APROVADO, STATUS_LICITACAO.REPROVADO];

export const TAMANHO_MAXIMO_LICITACAO = {
  NUMERO: 30,
  ORGAO: 120,
  OBJETO: 255,
  BUSCA: 100,
};
