// Tipos de taxa salva. Os codigos batem com os do back-end
// (backend/src/constantes/taxa.js); aqui ficam os textos da tela.
export const TIPOS_TAXA = {
  PLATAFORMA: 'PLATAFORMA',
  COMISSAO: 'COMISSAO',
  ADICIONAL: 'ADICIONAL',
};

export const ROTULOS_TIPO_TAXA = {
  PLATAFORMA: 'Taxa da plataforma',
  COMISSAO: 'Comissão de terceiros',
  ADICIONAL: 'Taxa adicional',
};

export const OPCOES_TIPO_TAXA = Object.entries(ROTULOS_TIPO_TAXA).map(([valor, rotulo]) => ({ valor, rotulo }));

export const TAXA_VAZIA = { nome: '', percentual: '', tipo: TIPOS_TAXA.PLATAFORMA };

export const TAMANHO_MAXIMO_NOME_TAXA = 80;
