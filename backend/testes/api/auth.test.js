import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

describe('API de autenticação', () => {
  let api;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(limparTabelas);
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  const conta = { nome: 'Kate Teste', email: 'kate@teste.com', senha: 'senha-segura' };

  test('cadastro devolve o usuário sem o hash e já com token', async () => {
    const { status, dados } = await api.post('/auth/cadastrar', conta);
    assert.equal(status, 201);
    assert.equal(dados.usuario.email, 'kate@teste.com');
    assert.equal('senha_hash' in dados.usuario, false);
    assert.ok(dados.token);
  });

  test('e-mail repetido responde 409 com mensagem acentuada', async () => {
    await api.post('/auth/cadastrar', conta);
    const { status, dados } = await api.post('/auth/cadastrar', conta);
    assert.equal(status, 409);
    assert.equal(dados.erro, 'Já existe uma conta com este e-mail.');
  });

  test('login com senha errada e com e-mail inexistente dão a mesma resposta', async () => {
    await api.post('/auth/cadastrar', conta);
    const senhaErrada = await api.post('/auth/login', { email: conta.email, senha: 'errada-123' });
    const emailInexistente = await api.post('/auth/login', { email: 'ninguem@teste.com', senha: 'errada-123' });
    assert.equal(senhaErrada.status, 401);
    assert.deepEqual(senhaErrada.dados, emailInexistente.dados);
  });

  test('rota protegida sem token responde 401', async () => {
    const { status } = await api.get('/auth/eu');
    assert.equal(status, 401);
  });

  test('corpo que não é JSON válido responde 400 sem expor detalhes internos', async () => {
    const resposta = await fetch(`${api.base}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ isto nao e json',
    });
    assert.equal(resposta.status, 400);
    assert.deepEqual(await resposta.json(), { erro: 'Os dados enviados não estão em um formato válido.' });
  });

  test('login sem corpo pede para preencher os campos', async () => {
    const { status, dados } = await api.post('/auth/login', {});
    assert.equal(status, 400);
    assert.equal(dados.erro, 'Preencha o e-mail e a senha.');
  });
});
