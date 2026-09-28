// Prepara o banco para uso: aplica as migracoes pendentes e insere os dados
// de demonstracao. Pode rodar quantas vezes quiser sem duplicar nada.
// Rodar com: npm run db:setup
import { pool } from '../db.js';
import { STATUS_LICITACAO } from '../constantes/licitacao.js';
import { licitacaoRepositorio } from '../repositorios/licitacaoRepositorio.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { gerarHash } from '../utils/senha.js';
import { aplicarMigracoes } from './migrar.js';

const USUARIO_DEMO = {
  nome: 'Kate Pessoa dos Santos',
  email: 'kate@calculecerto.com',
  senha: 'calcule123',
  cnpj: '12345678000199',
};

// Datas relativas a hoje, para que o painel sempre tenha alertas de prazo.
function daquiA(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

const LICITACOES_DEMO = [
  { numero: '1101', orgao: 'SEMSUR', objeto: 'Manutenção da iluminação pública', status: STATUS_LICITACAO.EM_ANDAMENTO, dataAbertura: daquiA(5) },
  { numero: '2045', orgao: 'Energisa', objeto: 'Conserto de máquinas pesadas', status: STATUS_LICITACAO.AGUARDANDO_APROVACAO, dataAbertura: daquiA(20) },
  { numero: '0873', orgao: 'Prefeitura de Rio Branco', objeto: 'Locação de tratores', status: STATUS_LICITACAO.APROVADO, dataAbertura: null },
];

async function garantirUsuarioDemo() {
  const existente = await usuarioRepositorio.buscarPorEmail(USUARIO_DEMO.email);
  if (existente) {
    console.log('Usuário de demonstração já existia.');
    return existente;
  }
  const criado = await usuarioRepositorio.inserir({
    nome: USUARIO_DEMO.nome,
    email: USUARIO_DEMO.email,
    senhaHash: await gerarHash(USUARIO_DEMO.senha),
    cnpj: USUARIO_DEMO.cnpj,
  });
  console.log(`Usuário de demonstração criado -> ${USUARIO_DEMO.email} / ${USUARIO_DEMO.senha}`);
  return criado;
}

async function garantirLicitacoesDemo(usuarioId) {
  const { total } = await licitacaoRepositorio.listar({ usuarioId, limite: 1, deslocamento: 0 });
  if (total > 0) {
    console.log('A usuária de demonstração já tem licitações.');
    return;
  }
  for (const licitacao of LICITACOES_DEMO) {
    await licitacaoRepositorio.inserir({ usuarioId, ...licitacao });
  }
  console.log(`${LICITACOES_DEMO.length} licitações de demonstração criadas.`);
}

async function main() {
  await aplicarMigracoes();
  const usuario = await garantirUsuarioDemo();
  await garantirLicitacoesDemo(usuario.id);
}

main()
  .catch((erro) => {
    console.error('Falha ao preparar o banco:', erro.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
