import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { consultar } from '../../src/db.js';
import { caixaDeSaida } from '../../src/utils/email.js';
import { hashDoTokenRecuperacao } from '../../src/utils/tokenRecuperacao.js';
import { iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

describe('API de recuperação de senha', () => {
  let api;
  const conta = { nome: 'Kate Teste', email: 'kate@teste.com', senha: 'senha-antiga' };

  const pedir = (email = conta.email) => api.post('/auth/esqueci-senha', { email });
  const redefinir = (token, novaSenha = 'senha-nova-123') => api.post('/auth/redefinir-senha', { token, novaSenha });
  const entrar = (senha) => api.post('/auth/login', { email: conta.email, senha });

  // Sem SMTP nos testes, o e-mail fica na caixa de saida; o token vem do link.
  function tokenDoUltimoEmail(email = conta.email) {
    const mensagem = caixaDeSaida.findLast((item) => item.para === email);
    const link = mensagem.texto.match(/https?:\/\/\S+/)[0];
    return new URL(link).searchParams.get('token');
  }

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    caixaDeSaida.length = 0;
    await api.post('/auth/cadastrar', conta);
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  test('responde igual para e-mail cadastrado e não cadastrado', async () => {
    assert.equal((await pedir()).status, 204);
    assert.equal((await pedir('ninguem@teste.com')).status, 204);
    assert.deepEqual(caixaDeSaida.map((mensagem) => mensagem.para), [conta.email]);
  });

  test('recusa e-mail em formato inválido e aceita maiúsculas e espaços', async () => {
    const invalido = await pedir('isto-nao-e-email');
    assert.equal(invalido.status, 400);
    assert.equal(invalido.dados.erro, 'Informe um e-mail válido.');

    assert.equal((await pedir('  KATE@Teste.com ')).status, 204);
    assert.equal(caixaDeSaida.length, 1);
  });

  test('o e-mail traz o link e o banco guarda só o hash do token', async () => {
    await pedir();
    const [mensagem] = caixaDeSaida;
    assert.match(mensagem.texto, /^Olá, Kate!/);
    assert.match(mensagem.texto, /http:\/\/localhost:5173\/redefinir-senha\?token=/);
    assert.match(mensagem.texto, /30 minutos/);

    const token = tokenDoUltimoEmail();
    const { rows } = await consultar('SELECT token_hash FROM tokens_recuperacao_senha');
    assert.equal(rows.length, 1);
    assert.notEqual(rows[0].token_hash, token);
    assert.equal(rows[0].token_hash, hashDoTokenRecuperacao(token));
  });

  test('redefine a senha com o link, que só vale uma vez', async () => {
    await pedir();
    const token = tokenDoUltimoEmail();

    assert.equal((await redefinir(token)).status, 204);
    assert.equal((await entrar('senha-nova-123')).status, 200);
    assert.equal((await entrar(conta.senha)).status, 401);

    const reuso = await redefinir(token, 'outra-senha-456');
    assert.equal(reuso.status, 400);
    assert.match(reuso.dados.erro, /inválido, expirou ou já foi usado/);
    assert.equal((await entrar('senha-nova-123')).status, 200);
  });

  test('senha curta não gasta o link', async () => {
    await pedir();
    const token = tokenDoUltimoEmail();
    const curta = await redefinir(token, '123');
    assert.equal(curta.status, 400);
    assert.equal(curta.dados.erro, 'A senha precisa ter ao menos 8 caracteres.');
    assert.equal((await redefinir(token)).status, 204);
  });

  test('recusa link expirado, inventado ou vazio', async () => {
    await pedir();
    const token = tokenDoUltimoEmail();
    await consultar(`UPDATE tokens_recuperacao_senha SET expira_em = NOW() - INTERVAL '1 second'`);

    assert.equal((await redefinir(token)).status, 400);
    assert.equal((await redefinir('token-inventado')).status, 400);
    assert.equal((await redefinir('')).status, 400);
    assert.equal((await entrar(conta.senha)).status, 200);
  });

  test('um pedido por minuto; o pedido novo invalida o link anterior', async () => {
    await pedir();
    const primeiro = tokenDoUltimoEmail();
    await pedir();
    assert.equal(caixaDeSaida.length, 1, 'o segundo pedido no mesmo minuto não envia outro e-mail');

    await consultar(`UPDATE tokens_recuperacao_senha SET criado_em = criado_em - INTERVAL '2 minutes'`);
    await pedir();
    assert.equal(caixaDeSaida.length, 2);
    const segundo = tokenDoUltimoEmail();
    assert.notEqual(segundo, primeiro);

    assert.equal((await redefinir(primeiro)).status, 400);
    assert.equal((await redefinir(segundo)).status, 204);
  });

  test('o nome digitado pela pessoa é escapado no HTML do e-mail', async () => {
    await api.post('/auth/cadastrar', { nome: '<b>Ana</b> Souza', email: 'ana@teste.com', senha: 'senha-de-teste' });
    await pedir('ana@teste.com');
    const { html } = caixaDeSaida.findLast((mensagem) => mensagem.para === 'ana@teste.com');
    assert.match(html, /Olá, &lt;b&gt;Ana&lt;\/b&gt;!/);
    assert.doesNotMatch(html, /<b>Ana<\/b>/);
  });
});
