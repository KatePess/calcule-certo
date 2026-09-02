const CHAVE_TOKEN = 'calcule-certo:token';

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN) || sessionStorage.getItem(CHAVE_TOKEN);
}

// lembrar = true  -> a sessao sobrevive ao fechar o navegador (localStorage)
// lembrar = false -> a sessao acaba quando a aba e fechada (sessionStorage)
export function guardarToken(token, lembrar) {
  limparToken();
  (lembrar ? localStorage : sessionStorage).setItem(CHAVE_TOKEN, token);
}

export function limparToken() {
  localStorage.removeItem(CHAVE_TOKEN);
  sessionStorage.removeItem(CHAVE_TOKEN);
}

async function pedir(caminho, { metodo = 'GET', corpo, autenticado = false } = {}) {
  const cabecalhos = {};
  if (corpo) cabecalhos['Content-Type'] = 'application/json';
  if (autenticado) cabecalhos.Authorization = `Bearer ${lerToken()}`;

  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Nao foi possivel falar com o servidor. Ele esta rodando?');
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro inesperado. Tente novamente.');
  }
  return dados;
}

export const api = {
  login: (email, senha) => pedir('/auth/login', { metodo: 'POST', corpo: { email, senha } }),
  cadastrar: (dados) => pedir('/auth/cadastrar', { metodo: 'POST', corpo: dados }),
  eu: () => pedir('/auth/eu', { autenticado: true }),
};
