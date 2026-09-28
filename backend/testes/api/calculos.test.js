import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

// Exemplo da secao 5.4 do plano, como a tela envia (valores em texto).
const EXEMPLO = {
  orcamentoEmpresa: '1100.00',
  quantidadeItens: '10',
  custoFixo: '150.00',
  custoVariavel: '80.00',
  seguro: '0',
  taxaPlataforma: '5',
  comissaoTerceiros: '10',
  margemLucro: '10',
  taxasAdicionais: [],
};

describe('API de cálculos', () => {
  let api;
  let kate;
  let licitacaoId;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    kate = await criarConta(api, 'Kate');
    const { dados } = await api.post('/licitacoes', { numero: '1101', orgao: 'SEMSUR' }, { token: kate.token });
    licitacaoId = dados.licitacao.id;
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  const simular = (corpo, token = kate.token) => api.post('/calculos/simular', corpo, { token });
  const salvar = (corpo, token = kate.token) => api.post('/calculos', corpo, { token });

  test('exige login', async () => {
    assert.equal((await api.post('/calculos/simular', EXEMPLO)).status, 401);
  });

  test('simula o exemplo da seção 5.4 sem gravar nada', async () => {
    const { status, dados } = await simular(EXEMPLO);
    assert.equal(status, 200);
    assert.equal(dados.resultado.resultadoFinal, '1266.67');
    assert.equal(dados.resultado.lucroEstimado, '126.67');
    assert.deepEqual(dados.resultado.comparacao, {
      orcamentoEmpresa: '1100.00',
      lucroComOrcamentoAtual: '-15.00',
      diferenca: '166.67',
    });
    assert.deepEqual(dados.avisos, []);

    const lista = await api.get('/licitacoes', { token: kate.token });
    assert.equal(lista.dados.itens[0].quantidadeCalculos, 0);
  });

  test('aceita números JSON além de texto', async () => {
    const { dados } = await simular({ ...EXEMPLO, quantidadeItens: 10, custoFixo: 150, custoVariavel: 80.5 });
    assert.equal(dados.resultado.custoTotal, '955.00');
  });

  test('explica cada problema de formato com o nome do campo', async () => {
    const semCusto = await simular({ ...EXEMPLO, custoFixo: '' });
    assert.equal(semCusto.status, 400);
    assert.equal(semCusto.dados.erro, 'Custo fixo: preencha este campo.');

    const tresCasas = await simular({ ...EXEMPLO, custoVariavel: '80.123' });
    assert.equal(tresCasas.dados.erro, 'Custo variável: informe um valor em reais com até 2 casas decimais.');

    const comVirgula = await simular({ ...EXEMPLO, custoFixo: '150,00' });
    assert.equal(comVirgula.status, 400);

    const percentualCem = await simular({ ...EXEMPLO, margemLucro: '100' });
    assert.equal(percentualCem.dados.erro, 'Margem de lucro: o percentual deve ser menor que 100%.');

    const quantidade = await simular({ ...EXEMPLO, quantidadeItens: '2.5' });
    assert.match(quantidade.dados.erro, /quantidade de itens/);
  });

  test('salva cálculo e relatório e devolve entradas e resultado', async () => {
    const { status, dados } = await salvar({ ...EXEMPLO, licitacaoId });
    assert.equal(status, 201);
    assert.ok(dados.relatorioId);
    assert.equal(dados.calculo.licitacao.numero, '1101');
    assert.equal(dados.calculo.entradas.custoFixo, '150.00');
    assert.equal(dados.calculo.entradas.taxaPlataforma, '5');
    assert.equal(dados.calculo.resultado.resultadoFinal, '1266.67');
    assert.equal(dados.calculo.resultado.comparacao.lucroComOrcamentoAtual, '-15.00');

    const lido = await api.get(`/calculos/${dados.calculo.id}`, { token: kate.token });
    assert.deepEqual(lido.dados.calculo, dados.calculo);
  });

  test('ignora um resultado adulterado enviado pelo navegador', async () => {
    const { dados } = await salvar({ ...EXEMPLO, licitacaoId, resultadoFinal: '1.00', resultado: { resultadoFinal: '1.00' } });
    assert.equal(dados.calculo.resultado.resultadoFinal, '1266.67');
  });

  test('guarda cópia das taxas adicionais com o valor calculado', async () => {
    const taxasAdicionais = [{ nome: 'Taxa bancária', percentual: '5' }];
    const { dados } = await salvar({ ...EXEMPLO, licitacaoId, taxasAdicionais });
    assert.deepEqual(dados.calculo.entradas.taxasAdicionais, taxasAdicionais);
    assert.deepEqual(dados.calculo.resultado.taxasAdicionais, [{ nome: 'Taxa bancária', percentual: '5', valor: '67.86' }]);
    assert.equal(dados.calculo.resultado.resultadoFinal, '1357.14');
  });

  test('exige uma licitação válida e do próprio usuário', async () => {
    assert.equal((await salvar(EXEMPLO)).status, 400);
    assert.equal((await salvar({ ...EXEMPLO, licitacaoId: 99999 })).status, 404);

    const intrusa = await criarConta(api, 'Outra pessoa');
    assert.equal((await salvar({ ...EXEMPLO, licitacaoId }, intrusa.token)).status, 404);
  });

  test('outra conta não lê o cálculo', async () => {
    const { dados } = await salvar({ ...EXEMPLO, licitacaoId });
    const intrusa = await criarConta(api, 'Outra pessoa');
    assert.equal((await api.get(`/calculos/${dados.calculo.id}`, { token: intrusa.token })).status, 404);
  });

  test('licitação passa a contar os cálculos e não pode mais ser excluída', async () => {
    await salvar({ ...EXEMPLO, licitacaoId });
    await salvar({ ...EXEMPLO, licitacaoId, margemLucro: '12' });

    const lista = await api.get('/licitacoes', { token: kate.token });
    assert.equal(lista.dados.itens[0].quantidadeCalculos, 2);

    const exclusao = await api.delete(`/licitacoes/${licitacaoId}`, { token: kate.token });
    assert.equal(exclusao.status, 409);
    assert.match(exclusao.dados.erro, /já tem cálculos salvos/);
  });
});
