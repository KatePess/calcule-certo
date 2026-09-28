import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

const CALCULO = {
  orcamentoEmpresa: '1100.00',
  quantidadeItens: '10',
  custoFixo: '150.00',
  custoVariavel: '80.00',
  taxaPlataforma: '5',
  comissaoTerceiros: '10',
  margemLucro: '10',
};

describe('API de relatórios', () => {
  let api;
  let kate;
  let semsur;
  let energisa;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    kate = await criarConta(api, 'Kate');
    semsur = (await api.post('/licitacoes', { numero: '1101', orgao: 'SEMSUR' }, { token: kate.token })).dados.licitacao;
    energisa = (await api.post('/licitacoes', { numero: '2045/A', orgao: 'Energisa' }, { token: kate.token })).dados.licitacao;
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  async function salvar(licitacaoId, extras = {}) {
    const { dados } = await api.post('/calculos', { ...CALCULO, ...extras, licitacaoId }, { token: kate.token });
    return dados;
  }

  const listar = (consulta = '', token = kate.token) => api.get(`/relatorios${consulta}`, { token });

  test('exige login', async () => {
    assert.equal((await api.get('/relatorios')).status, 401);
  });

  test('lista do mais recente para o mais antigo, com a licitação', async () => {
    await salvar(semsur.id);
    const segundo = await salvar(energisa.id);

    const { status, dados } = await listar();
    assert.equal(status, 200);
    assert.equal(dados.total, 2);
    assert.equal(dados.itens[0].id, segundo.relatorioId);
    assert.deepEqual(dados.itens[0].licitacao, { id: energisa.id, numero: '2045/A', orgao: 'Energisa' });
    assert.equal(dados.itens[0].resultadoFinal, '1266.67');
    assert.equal(dados.itens[0].baixadoEm, null);
  });

  test('filtra por licitação e por período', async () => {
    await salvar(semsur.id);
    await salvar(energisa.id);

    const soSemsur = await listar(`?licitacaoId=${semsur.id}`);
    assert.equal(soSemsur.dados.total, 1);
    assert.equal(soSemsur.dados.itens[0].licitacao.numero, '1101');

    const amanha = new Date(Date.now() + 86400000).toISOString();
    assert.equal((await listar(`?de=${encodeURIComponent(amanha)}`)).dados.total, 0);

    const ontem = new Date(Date.now() - 86400000).toISOString();
    assert.equal((await listar(`?de=${encodeURIComponent(ontem)}`)).dados.total, 2);
  });

  test('recusa filtro inválido', async () => {
    assert.equal((await listar('?de=ontem')).status, 400);
    assert.equal((await listar('?licitacaoId=abc')).status, 400);
  });

  test('baixa o PDF com nome legível e marca o primeiro download', async () => {
    const { relatorioId } = await salvar(energisa.id);

    const resposta = await api.get(`/relatorios/${relatorioId}/pdf`, { token: kate.token });
    assert.equal(resposta.status, 200);
    assert.equal(resposta.cabecalhos.get('content-type'), 'application/pdf');
    assert.match(resposta.cabecalhos.get('content-disposition'), /^attachment; filename="calculo-licitacao-2045-A-\d{4}-\d{2}-\d{2}\.pdf"$/);
    assert.equal(resposta.dados.subarray(0, 5).toString(), '%PDF-');
    assert.ok(resposta.dados.length > 5000);

    const primeiro = (await listar()).dados.itens[0].baixadoEm;
    assert.ok(primeiro);

    await api.get(`/relatorios/${relatorioId}/pdf`, { token: kate.token });
    assert.equal((await listar()).dados.itens[0].baixadoEm, primeiro);
  });

  test('aceita o fuso da tela e ignora fuso inválido', async () => {
    const { relatorioId } = await salvar(semsur.id);
    const comFuso = await api.get(`/relatorios/${relatorioId}/pdf?fuso=America/Sao_Paulo`, { token: kate.token });
    assert.equal(comFuso.status, 200);
    const fusoInvalido = await api.get(`/relatorios/${relatorioId}/pdf?fuso=Fuso/Inexistente`, { token: kate.token });
    assert.equal(fusoInvalido.status, 200);
    assert.equal(fusoInvalido.dados.subarray(0, 5).toString(), '%PDF-');
  });

  test('excluir o relatório exclui o cálculo e libera a licitação', async () => {
    const { relatorioId, calculo } = await salvar(semsur.id);

    assert.equal((await api.delete(`/relatorios/${relatorioId}`, { token: kate.token })).status, 204);
    assert.equal((await listar()).dados.total, 0);
    assert.equal((await api.get(`/calculos/${calculo.id}`, { token: kate.token })).status, 404);
    assert.equal((await api.delete(`/licitacoes/${semsur.id}`, { token: kate.token })).status, 204);
  });

  test('outra conta não lista, não baixa e não exclui', async () => {
    const { relatorioId } = await salvar(semsur.id);
    const intrusa = await criarConta(api, 'Outra pessoa');

    assert.equal((await listar('', intrusa.token)).dados.total, 0);
    assert.equal((await api.get(`/relatorios/${relatorioId}/pdf`, { token: intrusa.token })).status, 404);
    assert.equal((await api.delete(`/relatorios/${relatorioId}`, { token: intrusa.token })).status, 404);
    assert.equal((await listar()).dados.total, 1);
  });
});
