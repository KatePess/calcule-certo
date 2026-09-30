import imagemCadastro from '../assets/inicio/cadastro-orcamento.webp';
import imagemCalculo from '../assets/inicio/calculo-automatico.webp';
import imagemNovos from '../assets/inicio/novos-orcamentos.webp';
import imagemRelatorio from '../assets/inicio/relatorio-pdf.webp';
import { ROTAS } from './rotas.js';

// Partes da tela inicial que o menu do topo alcanca (ancoras #id).
export const SECOES_INICIO = [
  { id: 'sobre', rotulo: 'Sobre nós' },
  { id: 'duvidas', rotulo: 'Dúvidas' },
  { id: 'suporte', rotulo: 'Suporte' },
];

export const ID_DESTAQUES = 'destaques';

// Cartoes do carrossel "Destaques e funcionalidades". Com mais de quatro,
// as setas passam a aparecer tambem no computador.
export const DESTAQUES = [
  {
    titulo: 'Cálculo automático',
    descricao: 'Deixe o sistema trabalhar por você de forma eficiente.',
    imagem: imagemCalculo,
  },
  {
    titulo: 'Cadastro de orçamento',
    descricao: 'Integre seus orçamentos de forma fácil e segura.',
    imagem: imagemCadastro,
  },
  {
    titulo: 'Geração de novos orçamentos',
    descricao: 'Mantenha seus dados sempre em dia com um clique.',
    imagem: imagemNovos,
  },
  {
    titulo: 'Emissão de relatório PDF',
    descricao: 'Relatórios profissionais prontos para apresentação.',
    imagem: imagemRelatorio,
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
    pergunta: 'Como envio o cálculo para a minha equipe?',
    resposta: 'Todo cálculo salvo vira um relatório em PDF, pronto para baixar e enviar.',
  },
  {
    pergunta: 'Meus dados ficam protegidos?',
    resposta:
      'Sim. A sua senha nunca fica gravada do jeito que você digitou, e cada conta só enxerga os próprios cálculos e licitações.',
  },
];

// Atalhos da secao "Suporte": `rota` abre outra tela; `ancora`, outra parte desta.
export const ATALHOS_SUPORTE = [
  {
    titulo: 'Esqueci minha senha',
    texto: 'Receba um link por e-mail para criar uma nova senha.',
    rota: ROTAS.ESQUECI_SENHA,
  },
  {
    titulo: 'Perguntas frequentes',
    texto: 'Veja como o cálculo funciona e tire outras dúvidas.',
    ancora: 'duvidas',
  },
  {
    titulo: 'Criar uma conta',
    texto: 'Cadastre-se gratuitamente e faça o primeiro cálculo.',
    rota: ROTAS.CADASTRO,
  },
];
