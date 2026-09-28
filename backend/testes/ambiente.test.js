import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { conferirAmbiente } from '../src/config/ambiente.js';

function ambiente({ producao = false, segredo = 'segredo-qualquer', smtp = '' } = {}) {
  return { PRODUCAO: producao, JWT: { segredo }, SMTP: { host: smtp } };
}

const SEGREDO_FORTE = 'q8Vn3kZ0pL7wR2yT5uX9aB4cD6eF1gH0jK3mN8sQ';

describe('conferência da configuração', () => {
  test('não sobe sem JWT_SEGREDO', () => {
    assert.equal(conferirAmbiente(ambiente({ segredo: '' })).erros.length, 1);
  });

  test('em desenvolvimento aceita o segredo do .env.example', () => {
    assert.deepEqual(conferirAmbiente(ambiente({ segredo: 'troque-este-segredo-em-producao' })), { erros: [], avisos: [] });
  });

  test('em produção recusa o segredo de exemplo e segredos curtos', () => {
    assert.equal(conferirAmbiente(ambiente({ producao: true, segredo: 'troque-este-segredo-em-producao', smtp: 'smtp' })).erros.length, 1);
    assert.equal(conferirAmbiente(ambiente({ producao: true, segredo: 'curto', smtp: 'smtp' })).erros.length, 1);
  });

  test('em produção aceita segredo forte e só avisa se faltar SMTP', () => {
    assert.deepEqual(conferirAmbiente(ambiente({ producao: true, segredo: SEGREDO_FORTE, smtp: 'smtp' })), { erros: [], avisos: [] });
    const semSmtp = conferirAmbiente(ambiente({ producao: true, segredo: SEGREDO_FORTE }));
    assert.equal(semSmtp.erros.length, 0);
    assert.equal(semSmtp.avisos.length, 1);
  });
});
