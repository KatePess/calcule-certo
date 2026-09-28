// Sobe a API numa porta livre e oferece atalhos para fazer requisicoes.
import { once } from 'node:events';
import { criarApp } from '../../src/app.js';

export async function iniciarApi() {
  const servidor = criarApp().listen(0);
  await once(servidor, 'listening');
  const { port } = servidor.address();
  const base = `http://127.0.0.1:${port}/api`;

  async function pedir(metodo, caminho, { corpo, token } = {}) {
    const cabecalhos = {};
    if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json';
    if (token) cabecalhos.Authorization = `Bearer ${token}`;

    const resposta = await fetch(`${base}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });

    const tipo = resposta.headers.get('content-type') || '';
    const dados = tipo.includes('application/json') ? await resposta.json() : Buffer.from(await resposta.arrayBuffer());
    return { status: resposta.status, dados, cabecalhos: resposta.headers };
  }

  return {
    base,
    pedir,
    get: (caminho, opcoes) => pedir('GET', caminho, opcoes),
    post: (caminho, corpo, opcoes = {}) => pedir('POST', caminho, { ...opcoes, corpo }),
    put: (caminho, corpo, opcoes = {}) => pedir('PUT', caminho, { ...opcoes, corpo }),
    patch: (caminho, corpo, opcoes = {}) => pedir('PATCH', caminho, { ...opcoes, corpo }),
    delete: (caminho, opcoes) => pedir('DELETE', caminho, opcoes),
    fechar: () => new Promise((resolver) => servidor.close(resolver)),
  };
}

let contador = 0;

// Cria uma conta nova e devolve o token dela.
export async function criarConta(api, nome = 'Pessoa de Teste') {
  contador += 1;
  const { status, dados } = await api.post('/auth/cadastrar', {
    nome,
    email: `pessoa${contador}.${Date.now()}@teste.com`,
    senha: 'senha-de-teste',
  });
  if (status !== 201) throw new Error(`Falha ao criar conta de teste: ${JSON.stringify(dados)}`);
  return { token: dados.token, usuario: dados.usuario };
}
