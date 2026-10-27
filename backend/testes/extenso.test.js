import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { valorPorExtenso } from '../src/utils/extenso.js';

describe('Valor por extenso', () => {
  const casos = [
    ['0.00', 'zero real'],
    ['0.01', 'um centavo'],
    ['1.00', 'um real'],
    ['2.50', 'dois reais e cinquenta centavos'],
    ['100.00', 'cem reais'],
    ['101.00', 'cento e um reais'],
    ['1000.00', 'mil reais'],
    ['1020.00', 'mil e vinte reais'],
    ['1500.00', 'mil e quinhentos reais'],
    ['1266.67', 'mil, duzentos e sessenta e seis reais e sessenta e sete centavos'],
    ['11299.09', 'onze mil, duzentos e noventa e nove reais e nove centavos'],
    ['215000.00', 'duzentos e quinze mil reais'],
    ['1000000.00', 'um milhão de reais'],
    ['1500000.00', 'um milhão e quinhentos mil reais'],
    ['2000100.00', 'dois milhões e cem reais'],
    ['3250450.10', 'três milhões, duzentos e cinquenta mil, quatrocentos e cinquenta reais e dez centavos'],
  ];

  for (const [valor, esperado] of casos) {
    test(`${valor} -> ${esperado}`, () => {
      assert.equal(valorPorExtenso(valor), esperado);
    });
  }
});
