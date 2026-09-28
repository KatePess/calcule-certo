import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

// Data AAAA-MM-DD no fuso de Sao Paulo, somando dias.
function dia(somar) {
  const hoje = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  const [a, m, d] = hoje.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d + somar)).toISOString().slice(0, 10);
}

describe('API do painel', () => {
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

  const cadastrar = (dados) => api.post('/licitacoes', dados, { token: kate.token });
  const painel = () => api.get('/painel?fuso=America/Sao_Paulo', { token: kate.token });

  test('exige login', async () => {
    assert.equal((await api.get('/painel')).status, 401);
  });

  test('painel vazio para conta nova', async () => {
    const { status, dados } = await painel();
    assert.equal(status, 200);
    assert.equal(dados.hoje, dia(0));
    assert.deepEqual([dados.licitacoesRecentes, dados.relatoriosRecentes, dados.alertas], [[], [], []]);
  });

  test('alerta só licitações em aberto com abertura de hoje até 7 dias', async () => {
    await cadastrar({ numero: 'hoje', orgao: 'A', dataAbertura: dia(0) });
    await cadastrar({ numero: 'em-7', orgao: 'A', dataAbertura: dia(7) });
    await cadastrar({ numero: 'em-8', orgao: 'A', dataAbertura: dia(8) });
    await cadastrar({ numero: 'ontem', orgao: 'A', dataAbertura: dia(-1) });
    await cadastrar({ numero: 'aprovada', orgao: 'A', dataAbertura: dia(2), status: 'APROVADO' });
    await cadastrar({ numero: 'sem-data', orgao: 'A' });

    const { dados } = await painel();
    assert.deepEqual(
      dados.alertas.map((a) => [a.numero, a.diasParaAbertura]),
      [['hoje', 0], ['em-7', 7]],
    );
  });

  test('mostra as 3 licitações e os 4 relatórios mais recentes', async () => {
    const ids = [];
    for (let i = 1; i <= 4; i += 1) ids.push((await cadastrar({ numero: String(i), orgao: 'Órgão' })).dados.licitacao.id);
    for (let i = 0; i < 5; i += 1) {
      await api.post('/calculos', {
        licitacaoId: ids[0], quantidadeItens: '1', custoFixo: '100', custoVariavel: '0',
        taxaPlataforma: '0', comissaoTerceiros: '0', margemLucro: '10',
      }, { token: kate.token });
    }

    const { dados } = await painel();
    assert.equal(dados.totalLicitacoes, 4);
    assert.equal(dados.licitacoesRecentes.length, 3);
    // A licitacao 1 recebeu calculos, por isso e a mais recente.
    assert.equal(dados.licitacoesRecentes[0].numero, '1');
    assert.equal(dados.relatoriosRecentes.length, 4);
  });
});
