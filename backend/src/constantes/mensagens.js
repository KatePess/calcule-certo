import { QUANTIDADE_MAXIMA, TAMANHO_MAXIMO_NOME_TAXA, TAXAS_ADICIONAIS_MAXIMO } from './calculo.js';
import { TAMANHO_MAXIMO_LICITACAO } from './licitacao.js';
import { QUANTIDADE_DIGITOS_CNPJ, TAMANHO_MINIMO_SENHA } from './validacao.js';

// Textos que chegam ao usuario. Por isso ficam com acentuacao correta.
export const ERROS = {
  NOME_INVALIDO: 'Informe o nome completo.',
  EMAIL_INVALIDO: 'Informe um e-mail válido.',
  SENHA_CURTA: `A senha precisa ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  CNPJ_INVALIDO: `O CNPJ deve ter ${QUANTIDADE_DIGITOS_CNPJ} dígitos.`,
  CAMPOS_LOGIN_VAZIOS: 'Preencha o e-mail e a senha.',
  EMAIL_JA_CADASTRADO: 'Já existe uma conta com este e-mail.',
  // Mensagem generica de proposito: nao revela se o e-mail existe no sistema.
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
  FALHA_CADASTRO: 'Não foi possível concluir o cadastro.',
  FALHA_LOGIN: 'Não foi possível entrar agora. Tente novamente.',
  USUARIO_NAO_ENCONTRADO: 'Usuário não encontrado.',
  SENHA_ATUAL_INCORRETA: 'A senha atual está incorreta.',
  SENHA_ATUAL_VAZIA: 'Informe a senha atual.',
  SENHA_NOVA_IGUAL: 'A nova senha precisa ser diferente da atual.',
  TOKEN_AUSENTE: 'Token de acesso não enviado.',
  TOKEN_INVALIDO: 'Sessão expirada ou token inválido.',
  ROTA_NAO_ENCONTRADA: 'Rota não encontrada.',
  ERRO_INESPERADO: 'Erro inesperado no servidor. Tente novamente.',
  JSON_INVALIDO: 'Os dados enviados não estão em um formato válido.',
  REGISTRO_NAO_ENCONTRADO: 'Registro não encontrado.',

  LICITACAO_NAO_ENCONTRADA: 'Licitação não encontrada.',
  LICITACAO_NUMERO_OBRIGATORIO: 'Informe o número da licitação.',
  LICITACAO_NUMERO_LONGO: `O número da licitação pode ter até ${TAMANHO_MAXIMO_LICITACAO.NUMERO} caracteres.`,
  LICITACAO_ORGAO_OBRIGATORIO: 'Informe o órgão responsável pela licitação.',
  LICITACAO_ORGAO_LONGO: `O nome do órgão pode ter até ${TAMANHO_MAXIMO_LICITACAO.ORGAO} caracteres.`,
  LICITACAO_OBJETO_LONGO: `A descrição do objeto pode ter até ${TAMANHO_MAXIMO_LICITACAO.OBJETO} caracteres.`,
  LICITACAO_STATUS_INVALIDO: 'Status de licitação inválido.',
  LICITACAO_DATA_INVALIDA: 'Informe uma data de abertura válida.',
  LICITACAO_DUPLICADA: 'Você já cadastrou uma licitação com este número para este órgão.',
  LICITACAO_COM_CALCULOS: 'Esta licitação já tem cálculos salvos e não pode ser excluída. Exclua os relatórios dela primeiro.',

  CALCULO_NAO_ENCONTRADO: 'Cálculo não encontrado.',
  RELATORIO_NAO_ENCONTRADO: 'Relatório não encontrado.',
  RELATORIO_PERIODO_INVALIDO: 'Período do filtro inválido.',
  RELATORIO_FILTRO_INVALIDO: 'Filtro de licitação inválido.',
  CALCULO_LICITACAO_OBRIGATORIA: 'Escolha a licitação deste cálculo.',
  CALCULO_QUANTIDADE: `A quantidade de itens deve ser um número inteiro entre 1 e ${QUANTIDADE_MAXIMA.toLocaleString('pt-BR')}.`,
  CALCULO_CAMPO_OBRIGATORIO: (campo) => `${campo}: preencha este campo.`,
  CALCULO_VALOR_INVALIDO: (campo) => `${campo}: informe um valor em reais com até 2 casas decimais.`,
  CALCULO_VALOR_NEGATIVO: (campo) => `${campo}: o valor não pode ser negativo.`,
  CALCULO_PERCENTUAL_INVALIDO: (campo) => `${campo}: informe um percentual com até 4 casas decimais.`,
  CALCULO_PERCENTUAL_FORA: (campo) => `${campo}: o percentual deve ser menor que 100%.`,
  CALCULO_SOMA_PERCENTUAIS: (soma) => `A soma de taxas, comissão e margem chega a ${soma}%. Ela precisa ser menor que 100%.`,
  CALCULO_SEM_CUSTO: 'Informe ao menos um custo.',
  CALCULO_ACIMA_LIMITE: 'O valor calculado passa do limite suportado. Revise os custos e percentuais.',
  CALCULO_TAXAS_ADICIONAIS: `Informe no máximo ${TAXAS_ADICIONAIS_MAXIMO} taxas adicionais, cada uma com nome e percentual.`,
  CALCULO_NOME_TAXA: `O nome de cada taxa adicional deve ter entre 1 e ${TAMANHO_MAXIMO_NOME_TAXA} caracteres.`,

  TAXA_NAO_ENCONTRADA: 'Taxa não encontrada.',
  TAXA_NOME: `Informe o nome da taxa (até ${TAMANHO_MAXIMO_NOME_TAXA} caracteres).`,
  TAXA_TIPO_INVALIDO: 'Escolha se a taxa é da plataforma, uma comissão ou uma taxa adicional.',
  TAXA_DUPLICADA: 'Você já tem uma taxa salva com este nome.',
  TAXA_LIMITE: 'Você atingiu o limite de taxas salvas. Exclua alguma para cadastrar outra.',
};

// Avisos nao bloqueiam a operacao: so pedem atencao.
export const AVISOS = {
  PERCENTUAL_ALTO: (soma) => `Taxas e margem somam ${soma}% do preço. Confira os valores.`,
};
