import assert from 'node:assert/strict';
import { after, afterEach, before, beforeEach, describe, test } from 'node:test';
import { AMBIENTE } from '../../src/config/ambiente.js';
import { PROVEDORES_SOCIAIS } from '../../src/constantes/loginSocial.js';
import { iniciarApi } from '../apoio/api.js';
import { encerrarBanco, limparTabelas, prepararBancoDeTeste } from '../apoio/banco.js';

// O Google e o LinkedIn sao simulados: o fetch da API para os enderecos deles
// devolve respostas prontas, e o resto segue para a rede normalmente.
const fetchOriginal = globalThis.fetch;

function simularProvedor(chave, dadosDaPessoa) {
  const { urlToken, urlUsuario } = PROVEDORES_SOCIAIS[chave];
  globalThis.fetch = async (url, opcoes) => {
    if (url === urlToken) return Response.json({ access_token: 'token-do-provedor' });
    if (url === urlUsuario) return Response.json(dadosDaPessoa);
    return fetchOriginal(url, opcoes);
  };
}

describe('Login com Google e LinkedIn', () => {
  let api;

  before(async () => {
    await prepararBancoDeTeste();
    api = await iniciarApi();
    AMBIENTE.LOGIN_SOCIAL.google = { clienteId: 'id-google', segredo: 'segredo-google' };
    AMBIENTE.LOGIN_SOCIAL.linkedin = { clienteId: 'id-linkedin', segredo: 'segredo-linkedin' };
  });
  beforeEach(limparTabelas);
  afterEach(() => {
    globalThis.fetch = fetchOriginal;
  });
  after(async () => {
    await api.fechar();
    await encerrarBanco();
  });

  // Faz a requisicao sem seguir o redirecionamento e devolve o destino.
  async function destino(caminho) {
    const resposta = await fetchOriginal(`${api.base}${caminho}`, { redirect: 'manual' });
    assert.equal(resposta.status, 302);
    return new URL(resposta.headers.get('location'));
  }

  // Comeca o login e devolve o "state" que a API mandou ao provedor.
  async function iniciar(chave) {
    const url = await destino(`/auth/social/${chave}`);
    return url.searchParams.get('state');
  }

  const resultado = (url) => new URLSearchParams(url.hash.slice(1));

  test('o botão leva para a tela do provedor com o endereço de retorno da API', async () => {
    const url = await destino('/auth/social/google');
    assert.equal(url.origin + url.pathname, PROVEDORES_SOCIAIS.google.urlAutorizacao);
    assert.equal(url.searchParams.get('client_id'), 'id-google');
    assert.equal(url.searchParams.get('redirect_uri'), `${AMBIENTE.URL_API}/api/auth/social/google/retorno`);
    assert.ok(url.searchParams.get('state'));
  });

  test('primeiro login cria a conta sem senha e devolve o token ao front', async () => {
    const estado = await iniciar('google');
    simularProvedor('google', { sub: '1', name: 'Kate Google', email: 'Kate@Gmail.com', email_verified: true });

    const url = await destino(`/auth/social/google/retorno?code=abc&state=${estado}`);
    assert.equal(url.origin + url.pathname, `${AMBIENTE.URL_FRONT}/login/social`);
    const token = resultado(url).get('token');
    assert.ok(token);

    const { dados } = await api.get('/auth/eu', { token });
    assert.equal(dados.usuario.email, 'kate@gmail.com');
    assert.equal(dados.usuario.nome, 'Kate Google');

    // Sem senha, o login por e-mail e senha nao entra nessa conta.
    const login = await api.post('/auth/login', { email: 'kate@gmail.com', senha: 'qualquer-senha' });
    assert.equal(login.status, 401);
  });

  test('e-mail já cadastrado entra na mesma conta', async () => {
    const { dados: cadastro } = await api.post('/auth/cadastrar', {
      nome: 'Kate Teste',
      email: 'kate@empresa.com',
      senha: 'senha-segura',
    });
    const estado = await iniciar('linkedin');
    simularProvedor('linkedin', { sub: 'x', name: 'Outro Nome', email: 'kate@empresa.com', email_verified: true });

    const url = await destino(`/auth/social/linkedin/retorno?code=abc&state=${estado}`);
    const { dados } = await api.get('/auth/eu', { token: resultado(url).get('token') });
    assert.equal(dados.usuario.id, cadastro.usuario.id);
    assert.equal(dados.usuario.nome, 'Kate Teste');
  });

  test('state de outro provedor ou inventado é recusado', async () => {
    const estadoGoogle = await iniciar('google');
    const trocado = await destino(`/auth/social/linkedin/retorno?code=abc&state=${estadoGoogle}`);
    assert.equal(resultado(trocado).get('erro'), 'O tempo para concluir o login acabou. Tente novamente.');
    const inventado = await destino('/auth/social/google/retorno?code=abc&state=qualquer');
    assert.ok(resultado(inventado).get('erro'));
  });

  test('e-mail não confirmado pelo provedor é recusado', async () => {
    const estado = await iniciar('google');
    simularProvedor('google', { sub: '1', name: 'Alguém', email: 'alguem@gmail.com', email_verified: false });
    const url = await destino(`/auth/social/google/retorno?code=abc&state=${estado}`);
    assert.match(resultado(url).get('erro'), /não tem um e-mail confirmado/);
    assert.equal(resultado(url).get('token'), null);
  });

  test('cancelar na tela do provedor volta com aviso', async () => {
    const estado = await iniciar('linkedin');
    const url = await destino(`/auth/social/linkedin/retorno?error=user_cancelled_login&state=${estado}`);
    assert.equal(resultado(url).get('erro'), 'O login com LinkedIn foi cancelado.');
  });
});
