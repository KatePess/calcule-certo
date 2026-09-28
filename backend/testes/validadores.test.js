import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  ehCnpjValido,
  ehDataValida,
  ehEmailValido,
  ehNomeValido,
  ehSenhaValida,
} from '../src/utils/validadores.js';

describe('validadores', () => {
  test('nome precisa de ao menos 3 caracteres', () => {
    assert.equal(ehNomeValido('Ana'), true);
    assert.equal(ehNomeValido('Al'), false);
  });

  test('e-mail precisa ter usuário, @ e domínio com ponto', () => {
    assert.equal(ehEmailValido('kate@calculecerto.com'), true);
    assert.equal(ehEmailValido('kate.santos360@gmail.com'), true);
    assert.equal(ehEmailValido('kate@semponto'), false);
    assert.equal(ehEmailValido('sem-arroba.com'), false);
    assert.equal(ehEmailValido('com espaco@teste.com'), false);
  });

  test('senha precisa de ao menos 8 caracteres', () => {
    assert.equal(ehSenhaValida('12345678'), true);
    assert.equal(ehSenhaValida('1234567'), false);
  });

  test('CNPJ é opcional, mas quando preenchido precisa de 14 dígitos', () => {
    assert.equal(ehCnpjValido(''), true);
    assert.equal(ehCnpjValido('12345678000199'), true);
    assert.equal(ehCnpjValido('123'), false);
  });

  test('data precisa existir no calendário', () => {
    assert.equal(ehDataValida('2026-10-15'), true);
    assert.equal(ehDataValida('2028-02-29'), true);
    assert.equal(ehDataValida('2026-02-29'), false);
    assert.equal(ehDataValida('2026-13-01'), false);
    assert.equal(ehDataValida('15/10/2026'), false);
  });
});
