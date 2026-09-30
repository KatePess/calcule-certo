import { TAMANHO_MAXIMO_LICITACAO } from './licitacao.js';
import { QUANTIDADE_DIGITOS_CNPJ, TAMANHO_MINIMO_NOME, TAMANHO_MINIMO_SENHA } from './validacao.js';

// Textos exibidos ao usuario, reunidos em um lugar so para manter a
// linguagem do sistema consistente e facilitar revisao.
export const MENSAGENS = {
  SERVIDOR_INDISPONIVEL: 'Não foi possível falar com o servidor. Ele está rodando?',
  ERRO_INESPERADO: 'Erro inesperado. Tente novamente.',
  SESSAO_EXPIRADA: 'Sua sessão expirou. Entre novamente para continuar.',
  SENHA_REDEFINIDA: 'Senha redefinida. Entre com a nova senha.',
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
  CALCULO_LICITACAO: 'Escolha a licitação deste cálculo.',
  CALCULO_OBRIGATORIO: (campo) => `${campo}: preencha este campo.`,
  CALCULO_QUANTIDADE: 'A quantidade de itens deve ser pelo menos 1.',
  TAXA_ADICIONAL: 'Cada taxa adicional precisa de nome e percentual.',
  EMPRESA_EMAIL: 'Informe um e-mail corporativo válido.',
  EMPRESA_TELEFONE: 'Informe o telefone com DDD: 10 dígitos para fixo ou 11 para celular.',
  EMPRESA_FUNCIONARIOS: 'O número de funcionários deve ser um número inteiro, sem pontos.',
};

// Tela inicial publica (landing page do prototipo).
export const TEXTOS_INICIO = {
  TITULO: 'Calcule custos com precisão, precifique com segurança.',
  LEGENDA:
    'Aumente sua eficiência e precisão com nosso sistema completo para cálculo e gestão de licitações. Cadastre-se e comece já.',
  COMECAR: 'Começar agora',
  SAIBA_MAIS: 'Saiba mais',
  ACESSAR: 'Acessar conta',
  CADASTRAR: 'Cadastrar-se',
  DESTAQUES: 'Destaques e funcionalidades',
  DESTAQUES_ANTERIORES: 'Ver destaques anteriores',
  DESTAQUES_PROXIMOS: 'Ver próximos destaques',
  SOBRE: [
    'O Calcule Certo nasceu como Trabalho de Conclusão de Curso de Sistemas de Informação na UniNORTE, junto com uma empresa que participa de licitações públicas.',
    'Montar o preço de uma proposta na planilha leva cerca de 40 minutos, e um erro nas taxas da plataforma pode transformar o lucro em prejuízo. O sistema faz essa conta automaticamente, com precisão de centavos, e guarda cada cálculo em um relatório pronto para enviar.',
  ],
  SUPORTE_LEGENDA: 'Precisa de ajuda? Comece por aqui.',
  RODAPE: 'Trabalho de Conclusão de Curso · Sistemas de Informação · UniNORTE',
  ABRIR_MENU: 'Abrir menu',
  FECHAR_MENU: 'Fechar menu',
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
  PAINEL_TITULO: 'Olá!',
  PAINEL_LEGENDA: 'Crie sua conta gratuitamente, de forma rápida e segura.',
  BOTAO: 'Criar conta',
  BOTAO_ENVIANDO: 'Criando conta...',
  JA_TEM_CONTA: 'Já possui uma conta? Clique em entrar',
  ENTRAR: 'Entrar',
  OUTRAS_FORMAS: 'Ou continue com',
};

export const TEXTOS_ESQUECI_SENHA = {
  TITULO: 'Esqueci minha senha',
  LEGENDA: 'Informe o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.',
  PAINEL_TITULO: 'Sem problemas!',
  PAINEL_LEGENDA: 'Em poucos passos você volta a acessar seus cálculos.',
  BOTAO: 'Enviar link',
  BOTAO_ENVIANDO: 'Enviando...',
  ENVIADO_TITULO: 'Confira seu e-mail',
  enviado: (email, minutos) =>
    `Se houver uma conta com ${email}, enviamos um link para redefinir a senha. Ele vale por ${minutos} minutos.`,
  ENVIADO_DICA: 'Não chegou? Confira a caixa de spam ou peça de novo daqui a um minuto.',
  OUTRO_EMAIL: 'Usar outro e-mail',
  VOLTAR: 'Voltar para o login',
};

export const TEXTOS_REDEFINIR_SENHA = {
  TITULO: 'Criar nova senha',
  LEGENDA: 'Escolha uma senha nova para a sua conta.',
  PAINEL_TITULO: 'Quase lá!',
  PAINEL_LEGENDA: 'Depois de salvar, é só entrar com a nova senha.',
  BOTAO: 'Salvar nova senha',
  BOTAO_ENVIANDO: 'Salvando...',
  LINK_INCOMPLETO: 'Este link está incompleto. Abra o link do e-mail de novo ou peça outro.',
  SENHAS_DIFERENTES: 'A confirmação não é igual à nova senha.',
  PEDIR_NOVO: 'Pedir um novo link',
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

export const TEXTOS_CALCULO = {
  TITULO: 'Novo cálculo de licitação',
  BLOCO_CUSTO: 'Custo base',
  BLOCO_PARAMETROS: 'Parâmetros da licitação',
  INSTRUCAO_INICIO: 'Após todos os campos preenchidos clique em',
  INSTRUCAO_FIM: 'para gerar seu novo cálculo.',
  CONFIRMAR: 'Confirmar',
  CALCULANDO: 'Calculando...',
  ESCOLHA_LICITACAO: 'Escolha a licitação',
  SEM_LICITACAO: 'Nenhuma licitação cadastrada. Cadastre a primeira para calcular.',
  RESUMO_TITULO: 'Resumo do novo orçamento',
  NOVO_ORCAMENTO: 'Novo orçamento gerado',
  CUSTOS_TOTAIS: 'Custos totais',
  TOTAL_TAXAS: 'Total taxas e margem',
  LUCRO: 'Lucro estimado',
  VER_DETALHES: 'Ver como foi calculado',
  OCULTAR_DETALHES: 'Ocultar detalhamento',
  ATUALIZAR: 'Atualizar cálculo',
  SALVAR: 'Salvar em Relatórios',
  SALVANDO: 'Salvando...',
  SALVO_TITULO: 'Cálculo salvo',
  SALVO_TEXTO: 'O relatório já está disponível na área de relatórios, pronto para baixar em PDF.',
  VER_RELATORIOS: 'Ver relatórios',
  OUTRO_CALCULO: 'Fazer outro cálculo',
};

export const TEXTOS_RELATORIOS = {
  TITULO: 'Relatórios',
  LEGENDA: 'Aqui você irá encontrar todos os seus relatórios prontos para baixar.',
  TODAS_LICITACOES: 'Todas as licitações',
  VAZIO: 'Você ainda não salvou nenhum cálculo. Os relatórios aparecem aqui depois de salvar um cálculo.',
  SEM_RESULTADO: 'Nenhum relatório encontrado com esses filtros.',
  NOVO_CALCULO: 'Fazer um cálculo',
  BAIXAR: 'Baixar',
  BAIXANDO: 'Baixando...',
  FEITO: 'Feito',
  DICA_FEITO: 'Já baixado. Clique para baixar de novo.',
  EDITAR: 'Refazer o cálculo a partir deste',
  EXCLUIR: 'Excluir relatório',
  CONFIRMAR_EXCLUSAO_TITULO: 'Excluir relatório?',
  CONFIRMAR_EXCLUSAO: (numero, data) =>
    `O cálculo da licitação ${numero} feito em ${data} será excluído. Esta ação não pode ser desfeita.`,
};

export const TEXTOS_PAINEL = {
  LEGENDA: 'Acompanhe por aqui o status das suas atividades',
  NOVO_CALCULO: 'Gerar novo cálculo de licitação',
  LICITACOES: 'Minhas licitações',
  SEM_LICITACOES: 'Nenhuma licitação cadastrada ainda.',
  VER_TODAS: 'Ver todas',
  RELATORIOS: 'Relatórios recentes',
  SEM_RELATORIOS: 'Os relatórios dos cálculos salvos aparecem aqui.',
  ALERTAS: 'Alertas e prazos',
  SEM_ALERTAS: 'Nenhuma licitação abre nos próximos 7 dias.',
  quandoAbre: (dias) => (dias === 0 ? 'abre hoje' : dias === 1 ? 'abre amanhã' : `abre em ${dias} dias`),
  calculos: (n) => (n === 1 ? '1 cálculo' : `${n} cálculos`),
};

export const TEXTOS_PERFIL = {
  TITULO: 'Meu perfil',
  ABRIR_PERFIL: 'Abrir meu perfil',
  MENU: 'Opções do perfil',
  RODAPE: 'Para uma melhor experiência e um ambiente seguro, veja como cuidamos dos seus dados em',
  EMPRESA: 'Dados da empresa',
  EMPRESA_LEGENDA:
    'Preencha os dados da empresa que participa das licitações. Nenhum campo é obrigatório, e o CNPJ aparece no cabeçalho dos relatórios em PDF.',
  EMPRESA_SALVA: 'Dados da empresa salvos.',
  SALVAR_EMPRESA: 'Salvar dados da empresa',
  GRUPO_IDENTIFICACAO: 'Identificação',
  GRUPO_CONTATO: 'Contato',
  GRUPO_ATUACAO: 'Atuação',
  GRUPO_LOCALIZACAO: 'Localização',
  atualizadoEm: (data) => `Última atualização em ${data}.`,
  DADOS: 'Dados pessoais',
  DADOS_LEGENDA: 'Seu nome aparece no cabeçalho dos relatórios em PDF.',
  SALVAR_DADOS: 'Salvar dados',
  DADOS_SALVOS: 'Dados atualizados.',
  SENHA: 'Segurança',
  SENHA_LEGENDA: 'Para trocar a senha, confirme a senha atual. A nova vale a partir do próximo login.',
  SENHA_ATUAL: 'Senha atual',
  NOVA_SENHA: 'Nova senha',
  CONFIRMAR_SENHA: 'Repita a nova senha',
  SALVAR_SENHA: 'Trocar senha',
  SENHA_TROCADA: 'Senha alterada. Use a nova senha no próximo login.',
  SENHAS_DIFERENTES: 'A confirmação não é igual à nova senha.',
  TAXAS: 'Taxas salvas',
  TAXAS_LEGENDA: 'Salve as taxas que você usa com frequência para preenchê-las com um clique na tela de cálculo.',
  SEM_TAXAS: 'Nenhuma taxa salva ainda.',
  NOVA_TAXA: 'Nova taxa',
  NOME_TAXA_VAZIO: 'Informe o nome da taxa.',
  PERCENTUAL_VAZIO: 'Informe o percentual da taxa.',
  NOTIFICACOES: 'Notificações',
  NOTIFICACOES_LEGENDA:
    'Os avisos aparecem aqui e no menu quando uma licitação abre nos próximos 7 dias. Licitações aprovadas ou reprovadas não entram.',
  PRIVACIDADE: 'Privacidade',
  PRIVACIDADE_LEGENDA: 'Como o Calcule Certo cuida dos seus dados.',
};

export const DICAS = {
  LOGIN_SOCIAL: 'Login social previsto para uma sprint futura',
};
