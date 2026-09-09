// Cria a tabela de usuarios e insere um usuario de demonstracao.
// Rodar com: npm run db:setup
import { pool } from '../db.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { gerarHash } from '../utils/senha.js';

const USUARIO_DEMO = {
  nome: 'Kate Pessoa dos Santos',
  email: 'kate@calculecerto.com',
  senha: 'calcule123',
  cnpj: '12345678000199',
};

async function main() {
  await usuarioRepositorio.criarTabela();
  console.log('Tabela "usuarios" pronta.');

  const jaExiste = await usuarioRepositorio.buscarPorEmail(USUARIO_DEMO.email);
  if (jaExiste) {
    console.log('Usuario de demonstracao ja existia, nada a fazer.');
    return;
  }

  await usuarioRepositorio.inserir({
    nome: USUARIO_DEMO.nome,
    email: USUARIO_DEMO.email,
    senhaHash: await gerarHash(USUARIO_DEMO.senha),
    cnpj: USUARIO_DEMO.cnpj,
  });
  console.log(`Usuario de demonstracao criado -> ${USUARIO_DEMO.email} / ${USUARIO_DEMO.senha}`);
}

main()
  .catch((erro) => {
    console.error('Falha ao preparar o banco:', erro.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
