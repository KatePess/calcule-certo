// Cria a conta da oficina usada na apresentacao (Demo Day): empresa
// preenchida, licitacoes em varias situacoes, calculos ja feitos (com
// relatorio e PDF) e taxas salvas. Pode rodar quantas vezes quiser: se a
// conta ja existir, nada e alterado.
// Rodar com: npm run db:demo-oficina
//
// Os calculos passam pelo calculoServico, ou seja, pelo motor de calculo de
// verdade: os valores que aparecem na tela sao os mesmos que o sistema daria.
// Todos os dados sao ficticios (o CNPJ so tem os digitos verificadores certos).
import { pool } from '../db.js';
import { STATUS_LICITACAO } from '../constantes/licitacao.js';
import { TIPOS_TAXA } from '../constantes/taxa.js';
import { licitacaoRepositorio } from '../repositorios/licitacaoRepositorio.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { calculoServico } from '../servicos/calculoServico.js';
import { empresaServico } from '../servicos/empresaServico.js';
import { taxaServico } from '../servicos/taxaServico.js';
import { gerarHash } from '../utils/senha.js';
import { aplicarMigracoes } from './migrar.js';

const USUARIO = {
  nome: 'Kate Pessoa dos Santos',
  email: 'kate@silvamaquinas.com.br',
  senha: 'oficina123',
};

const EMPRESA = {
  razaoSocial: 'Silva Máquinas Pesadas Ltda',
  nomeFantasia: 'Silva Máquinas',
  cnpj: '45218307000100',
  inscricaoEstadual: '0123456789012',
  emailCorporativo: 'contato@silvamaquinas.com.br',
  telefone: '68999123456',
  funcionarios: '18',
  porte: 'EPP',
  ramoAtividade: 'Manutenção e reparo de máquinas pesadas',
  cidade: 'Rio Branco',
  uf: 'AC',
};

const TAXAS = [
  { nome: 'Portal de compras', percentual: '1.5', tipo: TIPOS_TAXA.PLATAFORMA },
  { nome: 'Representante comercial', percentual: '3', tipo: TIPOS_TAXA.COMISSAO },
  { nome: 'Simples Nacional', percentual: '8', tipo: TIPOS_TAXA.ADICIONAL },
];

// Datas relativas a hoje, para que o painel sempre tenha alertas de prazo.
function daquiA(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// Cada licitacao pode trazer o calculo que a oficina ja fez para ela.
const LICITACOES = [
  {
    numero: 'PE 012/2026',
    orgao: 'DERACRE',
    objeto: 'Manutenção corretiva de retroescavadeiras da frota rodoviária',
    status: STATUS_LICITACAO.EM_ANDAMENTO,
    dataAbertura: daquiA(3),
    calculo: {
      orcamentoEmpresa: '52000.00',
      quantidadeItens: '6',
      custoVariavel: '5800.00',
      custoFixo: '4200.00',
      seguro: '1100.00',
      taxaPlataforma: '1.5',
      comissaoTerceiros: '0',
      margemLucro: '18',
      taxasAdicionais: [{ nome: 'Simples Nacional', percentual: '8' }],
    },
  },
  {
    numero: 'PE 045/2026',
    orgao: 'Prefeitura de Rio Branco',
    objeto: 'Revisão geral de motoniveladoras da frota municipal',
    status: STATUS_LICITACAO.EDITAL_ABERTO,
    dataAbertura: daquiA(9),
    calculo: null,
  },
  {
    numero: 'PE 078/2026',
    orgao: 'SEAGRO',
    objeto: 'Manutenção preventiva de tratores agrícolas',
    status: STATUS_LICITACAO.AGUARDANDO_APROVACAO,
    dataAbertura: daquiA(21),
    calculo: {
      orcamentoEmpresa: null,
      quantidadeItens: '12',
      custoVariavel: '2350.00',
      custoFixo: '3600.00',
      seguro: '650.00',
      taxaPlataforma: '1.5',
      comissaoTerceiros: '3',
      margemLucro: '15',
      taxasAdicionais: [{ nome: 'Simples Nacional', percentual: '8' }],
    },
  },
  {
    numero: 'PE 031/2026',
    orgao: 'DEPASA',
    objeto: 'Reforma do sistema hidráulico de escavadeiras',
    status: STATUS_LICITACAO.APROVADO,
    dataAbertura: null,
    calculo: {
      orcamentoEmpresa: '78000.00',
      quantidadeItens: '4',
      custoVariavel: '12400.00',
      custoFixo: '5500.00',
      seguro: '1800.00',
      taxaPlataforma: '0',
      comissaoTerceiros: '0',
      margemLucro: '20',
      taxasAdicionais: [{ nome: 'Simples Nacional', percentual: '8' }],
    },
  },
];

async function criarConta() {
  const usuario = await usuarioRepositorio.inserir({
    nome: USUARIO.nome,
    email: USUARIO.email,
    senhaHash: await gerarHash(USUARIO.senha),
    cnpj: EMPRESA.cnpj,
  });
  await empresaServico.salvar(usuario.id, EMPRESA);

  for (const taxa of TAXAS) await taxaServico.salvarTaxa(usuario.id, taxa);

  for (const { calculo, ...licitacao } of LICITACOES) {
    const criada = await licitacaoRepositorio.inserir({ usuarioId: usuario.id, ...licitacao });
    if (!calculo) continue;
    const { calculo: salvo } = await calculoServico.salvar(usuario.id, { licitacaoId: criada.id, ...calculo });
    console.log(`  ${licitacao.numero} (${licitacao.orgao}): preço final R$ ${salvo.resultado.resultadoFinal}`);
  }
}

async function main() {
  await aplicarMigracoes();

  if (await usuarioRepositorio.buscarPorEmail(USUARIO.email)) {
    console.log(`A conta da oficina já existia (${USUARIO.email}). Nada foi alterado.`);
    return;
  }

  console.log('Criando a conta da oficina...');
  await criarConta();
  console.log(`\nPronto! Entre com ${USUARIO.email} / ${USUARIO.senha}`);
}

main()
  .catch((erro) => {
    console.error('Falha ao criar a conta da oficina:', erro.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
