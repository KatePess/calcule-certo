// Testes do motor de calculo (secao 10.1 do plano de implementacao).
// Os valores esperados foram calculados a parte, com aritmetica decimal,
// e nao a partir do proprio motor.
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { calcular } from '../src/servicos/motorCalculo.js';
import { ErroDeAplicacao } from '../src/utils/ErroDeAplicacao.js';
import { Dec } from '../src/utils/dinheiro.js';

// Monta uma entrada a partir de textos, como chegaria do calculoServico.
function entrada(dados = {}) {
  const base = {
    orcamentoEmpresa: null,
    quantidadeItens: 1,
    custoFixo: '0',
    custoVariavel: '0',
    seguro: '0',
    taxaPlataforma: '0',
    comissaoTerceiros: '0',
    margemLucro: '0',
    taxasAdicionais: [],
    ...dados,
  };
  return {
    ...base,
    orcamentoEmpresa: base.orcamentoEmpresa === null ? null : new Dec(base.orcamentoEmpresa),
    custoFixo: new Dec(base.custoFixo),
    custoVariavel: new Dec(base.custoVariavel),
    seguro: new Dec(base.seguro),
    taxaPlataforma: new Dec(base.taxaPlataforma),
    comissaoTerceiros: new Dec(base.comissaoTerceiros),
    margemLucro: new Dec(base.margemLucro),
    taxasAdicionais: base.taxasAdicionais.map((t) => ({ nome: t.nome, percentual: new Dec(t.percentual) })),
  };
}

// Confere que custo + taxas + comissao + adicionais + lucro = preco final.
function assertFechaNoCentavo(r) {
  const soma = new Dec(r.custoTotal)
    .plus(r.valorTaxaPlataforma)
    .plus(r.valorComissao)
    .plus(r.valorTaxasAdicionais)
    .plus(r.lucroEstimado);
  assert.equal(soma.toFixed(2), r.resultadoFinal);
}

function assertRecusa(dados, trecho) {
  assert.throws(
    () => calcular(entrada(dados)),
    (erro) => erro instanceof ErroDeAplicacao && erro.status === 400 && erro.message.includes(trecho),
  );
}

const EXEMPLO_5_4 = {
  quantidadeItens: 10,
  custoVariavel: '80',
  custoFixo: '150',
  taxaPlataforma: '5',
  comissaoTerceiros: '10',
  margemLucro: '10',
};

describe('motor de cálculo', () => {
  test('1. exemplo da seção 5.4 do plano, centavo por centavo', () => {
    const { resultado } = calcular(entrada(EXEMPLO_5_4));
    assert.equal(resultado.custoDireto, '800.00');
    assert.equal(resultado.custoIndireto, '150.00');
    assert.equal(resultado.custoTotal, '950.00');
    assert.equal(resultado.resultadoFinal, '1266.67');
    assert.equal(resultado.valorTaxaPlataforma, '63.33');
    assert.equal(resultado.valorComissao, '126.67');
    assert.equal(resultado.lucroEstimado, '126.67');
    assert.equal(resultado.totalTaxasEMargem, '316.67');
    assertFechaNoCentavo(resultado);
  });

  test('2. exemplo da seção 5.3: dividir preserva a margem', () => {
    const { resultado } = calcular(
      entrada({ custoFixo: '1000', taxaPlataforma: '20', comissaoTerceiros: '10', margemLucro: '10' }),
    );
    assert.equal(resultado.resultadoFinal, '1666.67');
    assert.equal(resultado.valorTaxaPlataforma, '333.33');
    assert.equal(resultado.valorComissao, '166.67');
    assert.equal(resultado.lucroEstimado, '166.67');
  });

  test('3. sem percentuais, o novo orçamento é o próprio custo total', () => {
    const { resultado } = calcular(entrada({ quantidadeItens: 3, custoVariavel: '10.50', custoFixo: '4.50' }));
    assert.equal(resultado.custoTotal, '36.00');
    assert.equal(resultado.resultadoFinal, '36.00');
    assert.equal(resultado.lucroEstimado, '0.00');
  });

  test('4. soma dos percentuais igual a 100% é recusada', () => {
    assertRecusa({ custoFixo: '100', taxaPlataforma: '50', comissaoTerceiros: '30', margemLucro: '20' }, 'chega a 100%');
  });

  test('5. soma dos percentuais acima de 100% é recusada', () => {
    assertRecusa({ custoFixo: '100', taxaPlataforma: '60', comissaoTerceiros: '30', margemLucro: '20.5' }, 'chega a 110,5%');
  });

  test('6. quantidade zero, negativa ou fracionada é recusada', () => {
    assertRecusa({ custoFixo: '100', quantidadeItens: 0 }, 'quantidade de itens');
    assertRecusa({ custoFixo: '100', quantidadeItens: -2 }, 'quantidade de itens');
    assertRecusa({ custoFixo: '100', quantidadeItens: 1.5 }, 'quantidade de itens');
  });

  test('7. resíduo de arredondamento é absorvido pelo lucro', () => {
    const { resultado } = calcular(
      entrada({ custoFixo: '100', taxaPlataforma: '10', comissaoTerceiros: '10', margemLucro: '10' }),
    );
    assert.equal(resultado.resultadoFinal, '142.86');
    assert.equal(resultado.valorTaxaPlataforma, '14.29');
    assert.equal(resultado.valorComissao, '14.29');
    assert.equal(resultado.lucroEstimado, '14.28');
    assertFechaNoCentavo(resultado);
  });

  test('8. valores na casa dos milhões não perdem precisão', () => {
    const { resultado } = calcular(
      entrada({ quantidadeItens: 100, custoVariavel: '1234567.89', custoFixo: '0.11', taxaPlataforma: '2.5', margemLucro: '7.5' }),
    );
    assert.equal(resultado.custoTotal, '123456789.11');
    assert.equal(resultado.resultadoFinal, '137174210.12');
    assert.equal(resultado.valorTaxaPlataforma, '3429355.25');
    assert.equal(resultado.lucroEstimado, '10288065.76');
    assertFechaNoCentavo(resultado);
  });

  test('9. resultado acima do limite do banco é recusado, mesmo com entradas válidas', () => {
    assertRecusa({ custoFixo: '999999999999.99', margemLucro: '50' }, 'passa do limite');
  });

  test('10. taxas adicionais entram na soma e no novo orçamento', () => {
    const { resultado } = calcular(
      entrada({ ...EXEMPLO_5_4, taxasAdicionais: [{ nome: 'Taxa bancária', percentual: '5' }] }),
    );
    assert.equal(resultado.percentualSobrePreco, '30');
    assert.equal(resultado.resultadoFinal, '1357.14');
    assert.deepEqual(resultado.taxasAdicionais, [{ nome: 'Taxa bancária', percentual: '5', valor: '67.86' }]);
    assert.equal(resultado.valorTaxasAdicionais, '67.86');
    assert.equal(resultado.lucroEstimado, '135.71');
    assertFechaNoCentavo(resultado);
  });

  test('11. comparação com o orçamento da empresa é opcional', () => {
    assert.equal(calcular(entrada(EXEMPLO_5_4)).resultado.comparacao, null);

    const { comparacao } = calcular(entrada({ ...EXEMPLO_5_4, orcamentoEmpresa: '1100' })).resultado;
    assert.deepEqual(comparacao, { orcamentoEmpresa: '1100.00', lucroComOrcamentoAtual: '-15.00', diferenca: '166.67' });
  });

  test('12. mesma entrada, mesmo resultado, sempre', () => {
    const primeiro = calcular(entrada(EXEMPLO_5_4));
    for (let i = 0; i < 20; i += 1) assert.deepEqual(calcular(entrada(EXEMPLO_5_4)), primeiro);
  });

  test('avisa, sem bloquear, quando taxas e margem passam de 60% do preço', () => {
    const { avisos } = calcular(entrada({ custoFixo: '100', taxaPlataforma: '40', margemLucro: '22.5' }));
    assert.deepEqual(avisos, ['Taxas e margem somam 62,5% do preço. Confira os valores.']);
    assert.deepEqual(calcular(entrada(EXEMPLO_5_4)).avisos, []);
  });

  test('recusa custo zero, valor negativo e percentual fora da faixa', () => {
    assertRecusa({}, 'ao menos um custo');
    assertRecusa({ custoFixo: '-1' }, 'Custo fixo: o valor não pode ser negativo');
    assertRecusa({ custoFixo: '100', taxaPlataforma: '100' }, 'Taxa da plataforma: o percentual deve ser menor que 100%');
  });

  test.todo('13. cenários reais da planilha do stakeholder (aguardando a planilha)');
});
