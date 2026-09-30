import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, test } from 'node:test';
import { criarConta, iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

const EMPRESA_COMPLETA = {
  razaoSocial: 'Kate Serviços Elétricos LTDA',
  nomeFantasia: 'Kate Elétrica',
  cnpj: '12.345.678/0001-95',
  inscricaoEstadual: 'ISENTO',
  emailCorporativo: '  Contato@KateEletrica.com.br ',
  telefone: '(68) 99999-1234',
  funcionarios: '12',
  porte: 'EPP',
  ramoAtividade: 'Manutenção elétrica',
  cidade: 'Rio Branco',
  uf: 'ac',
};

describe('API de dados da empresa', () => {
  let api;
  let kate;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
  });
  beforeEach(async () => {
    await limparTabelas();
    kate = await criarConta(api, 'Kate Teste');
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  const salvar = (dados, token = kate.token) => api.put('/empresa', dados, { token });

  test('exige login', async () => {
    assert.equal((await api.get('/empresa')).status, 401);
    assert.equal((await api.put('/empresa', EMPRESA_COMPLETA)).status, 401);
  });

  test('conta nova devolve a empresa em branco', async () => {
    const { status, dados } = await api.get('/empresa', { token: kate.token });
    assert.equal(status, 200);
    assert.equal(dados.empresa.razaoSocial, '');
    assert.equal(dados.empresa.funcionarios, null);
    assert.equal(dados.empresa.atualizadoEm, null);
  });

  test('salva, normaliza e depois atualiza os dados', async () => {
    const { status, dados } = await salvar(EMPRESA_COMPLETA);
    assert.equal(status, 200);
    const { atualizadoEm, ...empresa } = dados.empresa;
    assert.ok(atualizadoEm);
    assert.deepEqual(empresa, {
      razaoSocial: 'Kate Serviços Elétricos LTDA',
      nomeFantasia: 'Kate Elétrica',
      cnpj: '12345678000195',
      inscricaoEstadual: 'ISENTO',
      emailCorporativo: 'contato@kateeletrica.com.br',
      telefone: '68999991234',
      funcionarios: 12,
      porte: 'EPP',
      ramoAtividade: 'Manutenção elétrica',
      cidade: 'Rio Branco',
      uf: 'AC',
    });

    // Segunda gravacao atualiza a mesma empresa; campo vazio apaga o valor.
    const segunda = await salvar({ ...EMPRESA_COMPLETA, funcionarios: '15', nomeFantasia: '', porte: '' });
    assert.equal(segunda.dados.empresa.funcionarios, 15);
    assert.equal(segunda.dados.empresa.nomeFantasia, '');
    assert.equal(segunda.dados.empresa.porte, '');
    assert.equal((await api.get('/empresa', { token: kate.token })).dados.empresa.funcionarios, 15);
  });

  test('o CNPJ da empresa é o mesmo da conta', async () => {
    await salvar(EMPRESA_COMPLETA);
    assert.equal((await api.get('/auth/eu', { token: kate.token })).dados.usuario.cnpj, '12345678000195');

    // Atualizar o nome em "Dados pessoais" nao apaga o CNPJ.
    await api.put('/auth/perfil', { nome: 'Kate Pessoa' }, { token: kate.token });
    assert.equal((await api.get('/empresa', { token: kate.token })).dados.empresa.cnpj, '12345678000195');
  });

  test('valida cada campo preenchido', async () => {
    const casos = [
      [{ emailCorporativo: 'sem-arroba' }, 'Informe um e-mail corporativo válido.'],
      [{ telefone: '99999-1234' }, 'Informe o telefone com DDD: 10 dígitos para fixo ou 11 para celular.'],
      [{ funcionarios: '1.5' }, 'O número de funcionários deve ser um número inteiro, sem pontos.'],
      [{ funcionarios: '-3' }, 'O número de funcionários deve ser um número inteiro, sem pontos.'],
      [{ porte: 'GIGANTE' }, 'Escolha um porte de empresa da lista.'],
      [{ uf: 'XX' }, 'Escolha um estado (UF) da lista.'],
      [{ cnpj: '123' }, 'O CNPJ deve ter 14 dígitos.'],
      [{ razaoSocial: 'x'.repeat(151) }, 'Razão social: use no máximo 150 caracteres.'],
    ];
    for (const [campo, mensagem] of casos) {
      const { status, dados } = await salvar({ ...EMPRESA_COMPLETA, ...campo });
      assert.equal(status, 400, JSON.stringify(campo));
      assert.equal(dados.erro, mensagem);
    }
    // Nada foi gravado pelas tentativas invalidas.
    assert.equal((await api.get('/empresa', { token: kate.token })).dados.empresa.razaoSocial, '');
  });

  test('cada conta vê só a própria empresa', async () => {
    await salvar(EMPRESA_COMPLETA);
    const outra = await criarConta(api, 'Outra Pessoa');
    assert.equal((await api.get('/empresa', { token: outra.token })).dados.empresa.razaoSocial, '');

    await salvar({ razaoSocial: 'Outra Empresa' }, outra.token);
    assert.equal((await api.get('/empresa', { token: kate.token })).dados.empresa.razaoSocial, 'Kate Serviços Elétricos LTDA');
  });
});
