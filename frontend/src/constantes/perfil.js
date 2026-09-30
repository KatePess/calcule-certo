// Itens do menu que abre ao passar o mouse no nome, no rodape do menu
// lateral. "icone" e um nome de componentes/Icones.jsx; "id" vai no endereco
// (/perfil?secao=seguranca). Ajuda e Sair ficam so no menu lateral.
export const SECOES_PERFIL = [
  { id: 'empresa', rotulo: 'Dados da empresa', icone: 'predio' },
  { id: 'dados', rotulo: 'Editar dados pessoais', icone: 'pessoa' },
  { id: 'notificacoes', rotulo: 'Notificações', icone: 'sino' },
  { id: 'privacidade', rotulo: 'Privacidade', icone: 'cadeado' },
  { id: 'seguranca', rotulo: 'Segurança', icone: 'escudo' },
  { id: 'taxas', rotulo: 'Taxas salvas', icone: 'percentual' },
];

// O que /perfil mostra quando o endereco nao escolhe nenhum item.
export const SECAO_PADRAO = 'empresa';

// Conteudo da secao "Privacidade": so o que o sistema de fato faz.
export const ITENS_PRIVACIDADE = [
  {
    titulo: 'O que guardamos',
    texto: 'Nome, e-mail e CNPJ da conta, as licitações cadastradas, os cálculos, os relatórios e as taxas salvas.',
  },
  {
    titulo: 'Quem vê os seus dados',
    texto: 'Só você. Cada conta enxerga apenas as próprias licitações, cálculos e relatórios.',
  },
  {
    titulo: 'Sua senha',
    texto: 'Nunca fica gravada do jeito que você digitou: o sistema guarda apenas uma versão embaralhada dela (hash), que não pode ser desfeita.',
  },
  {
    titulo: 'Recuperação de senha',
    texto: 'O link de "Esqueci minha senha" vale por 30 minutos e só pode ser usado uma vez.',
  },
  {
    titulo: 'Relatórios em PDF',
    texto: 'São gerados na hora do download, a partir dos cálculos salvos, e não ficam guardados como arquivo.',
  },
];
