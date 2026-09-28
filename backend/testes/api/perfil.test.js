import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

describe('API de perfil e senha', () => {
  let api;
  let token;
  const conta = { nome: 'Kate Teste', email: 'kate@teste.com', senha: 'senha-antiga' };

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    token = (await api.post('/auth/cadastrar', conta)).dados.token;
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  test('atualiza nome e CNPJ, sem mudar o e-mail', async () => {
    const { status, dados } = await api.put('/auth/perfil', { nome: 'Kate Pessoa', cnpj: '12.345.678/0001-99', email: 'outro@x.com' }, { token });
    assert.equal(status, 200);
    assert.deepEqual(
      { nome: dados.usuario.nome, cnpj: dados.usuario.cnpj, email: dados.usuario.email },
      { nome: 'Kate Pessoa', cnpj: '12345678000199', email: 'kate@teste.com' },
    );
    assert.equal((await api.get('/auth/eu', { token })).dados.usuario.nome, 'Kate Pessoa');
  });

  test('valida o perfil', async () => {
    assert.equal((await api.put('/auth/perfil', { nome: 'Ka' }, { token })).status, 400);
    assert.equal((await api.put('/auth/perfil', { nome: 'Kate', cnpj: '123' }, { token })).status, 400);
    assert.equal((await api.put('/auth/perfil', { nome: 'Kate' })).status, 401);
  });

  test('troca a senha exigindo a atual', async () => {
    const errada = await api.put('/auth/senha', { senhaAtual: 'nao-e-essa', novaSenha: 'senha-nova-123' }, { token });
    assert.equal(errada.status, 400);
    assert.equal(errada.dados.erro, 'A senha atual está incorreta.');

    assert.equal((await api.put('/auth/senha', { senhaAtual: conta.senha, novaSenha: 'curta' }, { token })).status, 400);
    assert.equal((await api.put('/auth/senha', { senhaAtual: conta.senha, novaSenha: conta.senha }, { token })).status, 400);

    const certa = await api.put('/auth/senha', { senhaAtual: conta.senha, novaSenha: 'senha-nova-123' }, { token });
    assert.equal(certa.status, 204);

    assert.equal((await api.post('/auth/login', { email: conta.email, senha: conta.senha })).status, 401);
    assert.equal((await api.post('/auth/login', { email: conta.email, senha: 'senha-nova-123' })).status, 200);
  });
});
