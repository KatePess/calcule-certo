import { TAMANHO_MAXIMO_LICITACAO } from './licitacao.js';
import { QUANTIDADE_DIGITOS_CNPJ, TAMANHO_MINIMO_NOME, TAMANHO_MINIMO_SENHA } from './validacao.js';

// Textos exibidos ao usuario, reunidos em um lugar so para manter a
// linguagem do sistema consistente e facilitar revisao.
export const MENSAGENS = {
  SERVIDOR_INDISPONIVEL: 'Não foi possível falar com o servidor. Ele está rodando?',
  ERRO_INESPERADO: 'Erro inesperado. Tente novamente.',
  SESSAO_EXPIRADA: 'Sua sessão expirou. Entre novamente para continuar.',
  RECUPERACAO_INDISPONIVEL: 'Recuperação de senha ainda não implementada (próxima sprint).',
  CARREGANDO: 'Carregando...',
};

// Mensagens da validacao feita na tela, antes de enviar ao servidor.
// O servidor valida de novo: esta etapa so antecipa o aviso ao usuario.
export const VALIDACAO = {
  EMAIL: 'Informe um e-mail válido.',
  SENHA_VAZIA: 'Informe a sua senha.',
  SENHA_CURTA: `A senha precisa ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`,
  NOME: `Informe o nome completo (ao menos ${TAMANHO_MINIMO_NOME} letras).`,
  CNPJ: `O CNPJ deve ter ${QUANTIDADE_DIGITOS_CNPJ} dígitos.`,
  LICITACAO_NUMERO: 'Informe o número da licitação.',
  LICITACAO_ORGAO: 'Informe o órgão responsável pela licitação.',
  LICITACAO_OBJETO: `A descrição do objeto pode ter até ${TAMANHO_MAXIMO_LICITACAO.OBJETO} caracteres.`,
};

export const TEXTOS_LOGIN = {
  TITULO: 'Acesse sua conta',
  LEGENDA: 'Use o e-mail e a senha cadastrados para acessar sua conta.',
  PAINEL_TITULO: 'BEM-VINDO AO CALCULE CERTO',
  PAINEL_LEGENDA: 'Seu sistema mais completo de cálculo de licitações!',
  BOTAO: 'Entrar',
  BOTAO_ENVIANDO: 'Entrando...',
};

export const TEXTOS_CADASTRO = {
  TITULO: 'Criar conta',
  LEGENDA: 'Preencha os dados abaixo para começar a usar o sistema.',
  PAINEL_TITULO: 'Olá!',
  PAINEL_LEGENDA: 'Crie sua conta gratuitamente, de forma rápida e segura.',
  BOTAO: 'Criar conta',
  BOTAO_ENVIANDO: 'Criando conta...',
};

export const TEXTOS_RESUMO = {
  TITULO: 'Resumo do sistema',
  LEGENDA: 'Todas as suas licitações e a situação de cada uma.',
  NOVA: 'Nova licitação',
  BUSCA: 'Buscar por número, órgão ou objeto',
  TODOS_STATUS: 'Todos os status',
  VAZIO: 'Nenhuma licitação cadastrada ainda. Cadastre a primeira para começar.',
  SEM_RESULTADO: 'Nenhuma licitação encontrada com esses filtros.',
};

export const TEXTOS_LICITACAO = {
  TITULO_NOVA: 'Nova licitação',
  TITULO_EDITAR: 'Editar licitação',
  SALVAR: 'Salvar',
  SALVANDO: 'Salvando...',
  EXCLUIR: 'Excluir licitação',
  CONFIRMAR_EXCLUSAO: (numero) => `Excluir a licitação ${numero}? Esta ação não pode ser desfeita.`,
};

export const DICAS = {
  LOGIN_SOCIAL: 'Login social previsto para uma sprint futura',
  RECUPERAR_SENHA: 'Recuperação de senha prevista para a próxima sprint',
  BUSCA_GLOBAL: 'Busca geral prevista para uma versão futura',
};
