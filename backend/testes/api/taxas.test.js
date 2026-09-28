import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

describe('API de taxas salvas', () => {
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

  const salvar = (dados, token = kate.token) => api.post('/taxas', dados, { token });

  test('exige login', async () => {
    assert.equal((await api.get('/taxas')).status, 401);
  });

  test('salva, lista agrupando por tipo, edita e exclui', async () => {
    const criada = await salvar({ nome: 'Plataforma BLL', percentual: '1.5', tipo: 'PLATAFORMA' });
    assert.equal(criada.status, 201);
    assert.deepEqual(
      { nome: criada.dados.taxa.nome, percentual: criada.dados.taxa.percentual, tipo: criada.dados.taxa.tipo },
      { nome: 'Plataforma BLL', percentual: '1.5', tipo: 'PLATAFORMA' },
    );
    await salvar({ nome: 'Taxa bancária', percentual: '0.75', tipo: 'ADICIONAL' });
    await salvar({ nome: 'Representante', percentual: '3', tipo: 'COMISSAO' });

    // Mesma ordem da tela de calculo, e nao a alfabetica do codigo do tipo.
    const lista = await api.get('/taxas', { token: kate.token });
    assert.deepEqual(lista.dados.taxas.map((t) => t.tipo), ['PLATAFORMA', 'COMISSAO', 'ADICIONAL']);

    const id = criada.dados.taxa.id;
    const editada = await api.put(`/taxas/${id}`, { nome: 'Plataforma BLL', percentual: '2', tipo: 'PLATAFORMA' }, { token: kate.token });
    assert.equal(editada.dados.taxa.percentual, '2');

    assert.equal((await api.delete(`/taxas/${id}`, { token: kate.token })).status, 204);
    assert.equal((await api.get('/taxas', { token: kate.token })).dados.taxas.length, 2);
  });

  test('valida nome, percentual e tipo', async () => {
    assert.equal((await salvar({ nome: '', percentual: '1', tipo: 'PLATAFORMA' })).status, 400);
    assert.equal((await salvar({ nome: 'X', percentual: '100', tipo: 'PLATAFORMA' })).dados.erro, 'Percentual: o percentual deve ser menor que 100%.');
    assert.equal((await salvar({ nome: 'X', percentual: '1.23456', tipo: 'PLATAFORMA' })).status, 400);
    assert.equal((await salvar({ nome: 'X', percentual: '1', tipo: 'OUTRO' })).status, 400);
  });

  test('não aceita dois nomes iguais para a mesma conta', async () => {
    await salvar({ nome: 'Comissão padrão', percentual: '10', tipo: 'COMISSAO' });
    const repetida = await salvar({ nome: 'Comissão padrão', percentual: '8', tipo: 'COMISSAO' });
    assert.equal(repetida.status, 409);

    const outra = await criarConta(api, 'Outra pessoa');
    assert.equal((await salvar({ nome: 'Comissão padrão', percentual: '8', tipo: 'COMISSAO' }, outra.token)).status, 201);
  });

  test('outra conta não vê, não edita e não exclui', async () => {
    const { dados } = await salvar({ nome: 'Minha taxa', percentual: '3', tipo: 'ADICIONAL' });
    const intrusa = await criarConta(api, 'Outra pessoa');
    assert.equal((await api.get('/taxas', { token: intrusa.token })).dados.taxas.length, 0);
    assert.equal((await api.put(`/taxas/${dados.taxa.id}`, { nome: 'x', percentual: '1', tipo: 'ADICIONAL' }, { token: intrusa.token })).status, 404);
    assert.equal((await api.delete(`/taxas/${dados.taxa.id}`, { token: intrusa.token })).status, 404);
  });

  test('alterar uma taxa salva não muda cálculos antigos', async () => {
    const licitacao = (await api.post('/licitacoes', { numero: '1', orgao: 'Órgão' }, { token: kate.token })).dados.licitacao;
    const taxa = (await salvar({ nome: 'Taxa bancária', percentual: '5', tipo: 'ADICIONAL' })).dados.taxa;

    const calculo = await api.post('/calculos', {
      licitacaoId: licitacao.id, quantidadeItens: '10', custoFixo: '150', custoVariavel: '80',
      taxaPlataforma: '5', comissaoTerceiros: '10', margemLucro: '10',
      taxasAdicionais: [{ nome: taxa.nome, percentual: taxa.percentual }],
    }, { token: kate.token });

    await api.put(`/taxas/${taxa.id}`, { nome: 'Taxa bancária', percentual: '9', tipo: 'ADICIONAL' }, { token: kate.token });

    const relido = await api.get(`/calculos/${calculo.dados.calculo.id}`, { token: kate.token });
    assert.equal(relido.dados.calculo.entradas.taxasAdicionais[0].percentual, '5');
    assert.equal(relido.dados.calculo.resultado.resultadoFinal, '1357.14');
  });
});
