import { ROTAS } from './rotas.js';

// Itens do menu lateral, conforme o prototipo de alta fidelidade do TCC.
// "icone" e o nome de um componente de componentes/Icones.jsx.
// "mostraAlertas" exibe ao lado do item a quantidade de alertas de prazo.
// O perfil nao entra na lista: abre pelo nome de quem esta logado, no rodape.
export const ITENS_MENU = [
  { rotulo: 'Home', rota: ROTAS.HOME, icone: 'casa', mostraAlertas: true },
  { rotulo: 'Orçamento', rota: ROTAS.ORCAMENTO, icone: 'cartao' },
  { rotulo: 'Relatórios', rota: ROTAS.RELATORIOS, icone: 'pasta' },
  { rotulo: 'Resumo do sistema', rota: ROTAS.RESUMO, icone: 'resumo' },
];
