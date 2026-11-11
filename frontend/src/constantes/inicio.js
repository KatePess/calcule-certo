import { ROTAS } from './rotas.js';

// Partes da tela inicial que o menu do topo alcanca (ancoras #id).
export const SECOES_INICIO = [
  { id: 'como-funciona', rotulo: 'Como funciona' },
  { id: 'sobre', rotulo: 'Sobre nós' },
  { id: 'duvidas', rotulo: 'Dúvidas' },
];

// Secao "Como funciona": o fluxo principal do sistema.
export const PASSOS_COMO_FUNCIONA = [
  {
    titulo: 'Cadastre a licitação',
    texto: 'Número, órgão, objeto e data de abertura.',
  },
  {
    titulo: 'Informe custos e taxas',
    texto: 'Custos, taxa da plataforma, comissão e margem.',
  },
  {
    titulo: 'Baixe a proposta',
    texto: 'Preço certo e proposta em PDF pronta.',
  },
];

export const PERGUNTAS_FREQUENTES = [
  {
    pergunta: 'Preciso instalar alguma coisa?',
    resposta: 'Não. O Calcule Certo funciona no navegador, no computador ou no celular. Basta criar uma conta.',
  },
  {
    pergunta: 'Como o novo orçamento é calculado?',
    resposta:
      'Taxa da plataforma, comissão e margem de lucro são cobradas sobre o preço final. Por isso o sistema divide o custo total pela parte do preço que sobra depois delas. Cada cálculo mostra esse passo a passo, centavo por centavo.',
  },
  {
    pergunta: 'Posso reaproveitar as taxas que uso sempre?',
    resposta: 'Sim. Salve as taxas no seu perfil e preencha com um clique na tela de cálculo.',
  },
  {
    pergunta: 'O que vai na proposta em PDF?',
    resposta:
      'Os dados da sua empresa, o órgão e o objeto da licitação, os itens com quantidade e valores, o valor global por extenso, a validade e o campo de assinatura. Custos e margem de lucro ficam só no sistema.',
  },
  {
    pergunta: 'Meus dados ficam protegidos?',
    resposta:
      'Sim. A sua senha nunca fica gravada do jeito que você digitou, e cada conta só enxerga os próprios cálculos e licitações.',
  },
];

// Numeros em destaque na secao "Sobre nos".
export const NUMEROS_SOBRE = [
  { valor: '40 min', texto: 'para montar um preço na planilha' },
  { valor: 'R$ 0,01', texto: 'de precisão em cada cálculo' },
  { valor: '1 clique', texto: 'para baixar a proposta em PDF' },
];

// Links do rodape (substituem a antiga secao "Suporte").
export const LINKS_RODAPE = [
  { rotulo: 'Acessar conta', rota: ROTAS.LOGIN },
  { rotulo: 'Criar conta', rota: ROTAS.CADASTRO },
  { rotulo: 'Esqueci minha senha', rota: ROTAS.ESQUECI_SENHA },
];
