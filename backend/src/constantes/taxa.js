// Tipos de taxa salva. Devem bater com o CHECK da tabela taxas_customizadas.
export const TIPOS_TAXA = {
  PLATAFORMA: 'PLATAFORMA',
  COMISSAO: 'COMISSAO',
  ADICIONAL: 'ADICIONAL',
};

export const LISTA_TIPOS_TAXA = Object.values(TIPOS_TAXA);

// Limite de taxas salvas por usuario, para a lista caber na tela.
export const TAXAS_SALVAS_MAXIMO = 50;
