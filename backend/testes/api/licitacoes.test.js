import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

describe('API de licitações', () => {
  let api;
  let kate;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    kate = await criarConta(api, 'Kate');
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  const nova = { numero: '1101', orgao: 'SEMSUR', objeto: 'Iluminação pública', dataAbertura: '2026-10-20' };

  async function cadastrar(dados = nova, token = kate.token) {
    return api.post('/licitacoes', dados, { token });
  }

  test('exige login', async () => {
    const { status } = await api.get('/licitacoes');
    assert.equal(status, 401);
  });

  test('cadastra com status inicial EDITAL_ABERTO e devolve em camelCase', async () => {
    const { status, dados } = await cadastrar();
    assert.equal(status, 201);
    assert.equal(dados.licitacao.status, 'EDITAL_ABERTO');
    assert.equal(dados.licitacao.dataAbertura, '2026-10-20');
    assert.equal(dados.licitacao.orgao, 'SEMSUR');
  });

  test('valida campos obrigatórios, tamanho, status e data', async () => {
    assert.equal((await cadastrar({ ...nova, numero: '  ' })).dados.erro, 'Informe o número da licitação.');
    assert.equal((await cadastrar({ ...nova, orgao: '' })).dados.erro, 'Informe o órgão responsável pela licitação.');
    assert.equal((await cadastrar({ ...nova, numero: 'x'.repeat(31) })).status, 400);
    assert.equal((await cadastrar({ ...nova, status: 'INVENTADO' })).status, 400);
    assert.equal((await cadastrar({ ...nova, dataAbertura: '2026-02-30' })).status, 400);
  });

  test('não aceita o mesmo número duas vezes no mesmo órgão', async () => {
    await cadastrar();
    const { status } = await cadastrar();
    assert.equal(status, 409);
    const outroOrgao = await cadastrar({ ...nova, orgao: 'Energisa' });
    assert.equal(outroOrgao.status, 201);
  });

  test('lista com paginação, filtro por status e busca', async () => {
    for (let i = 1; i <= 12; i += 1) {
      await cadastrar({ numero: String(i), orgao: i % 2 ? 'SEMSUR' : 'Energisa', status: i <= 3 ? 'APROVADO' : 'EDITAL_ABERTO' });
    }
    const pagina1 = await api.get('/licitacoes?pagina=1&limite=5', { token: kate.token });
    assert.equal(pagina1.dados.itens.length, 5);
    assert.equal(pagina1.dados.total, 12);
    assert.equal(pagina1.dados.totalPaginas, 3);

    const aprovadas = await api.get('/licitacoes?status=APROVADO', { token: kate.token });
    assert.equal(aprovadas.dados.total, 3);

    const energisa = await api.get('/licitacoes?busca=energ', { token: kate.token });
    assert.equal(energisa.dados.total, 6);
  });

  test('busca trata % como texto, e não como curinga', async () => {
    await cadastrar();
    const { dados } = await api.get('/licitacoes?busca=%25', { token: kate.token });
    assert.equal(dados.total, 0);
  });

  test('edita, muda o status e exclui', async () => {
    const { dados } = await cadastrar();
    const id = dados.licitacao.id;

    const editada = await api.put(`/licitacoes/${id}`, { ...nova, objeto: 'Novo objeto' }, { token: kate.token });
    assert.equal(editada.dados.licitacao.objeto, 'Novo objeto');

    const status = await api.patch(`/licitacoes/${id}/status`, { status: 'APROVADO' }, { token: kate.token });
    assert.equal(status.dados.licitacao.status, 'APROVADO');

    const exclusao = await api.delete(`/licitacoes/${id}`, { token: kate.token });
    assert.equal(exclusao.status, 204);
    assert.equal((await api.get(`/licitacoes/${id}`, { token: kate.token })).status, 404);
  });

  test('uma conta não vê nem altera licitações de outra', async () => {
    const { dados } = await cadastrar();
    const id = dados.licitacao.id;
    const intrusa = await criarConta(api, 'Outra pessoa');

    assert.equal((await api.get('/licitacoes', { token: intrusa.token })).dados.total, 0);
    assert.equal((await api.get(`/licitacoes/${id}`, { token: intrusa.token })).status, 404);
    assert.equal((await api.put(`/licitacoes/${id}`, nova, { token: intrusa.token })).status, 404);
    assert.equal((await api.patch(`/licitacoes/${id}/status`, { status: 'APROVADO' }, { token: intrusa.token })).status, 404);
    assert.equal((await api.delete(`/licitacoes/${id}`, { token: intrusa.token })).status, 404);
  });

  test('id que não é número responde 404', async () => {
    const { status } = await api.get('/licitacoes/abc', { token: kate.token });
    assert.equal(status, 404);
  });
});
