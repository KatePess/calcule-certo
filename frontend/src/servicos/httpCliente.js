import { BASE_API, METODOS } from '../constantes/api.js';
import { MENSAGENS } from '../constantes/mensagens.js';
import { lerToken } from '../utils/armazenamento.js';

// Ponto unico de saida das requisicoes HTTP. Cuida do cabecalho de
// autenticacao, da serializacao em JSON e da traducao dos erros.
export async function requisitar(caminho, { metodo = METODOS.GET, corpo, autenticado = false } = {}) {
  const cabecalhos = {};
  if (corpo) cabecalhos['Content-Type'] = 'application/json';
  if (autenticado) cabecalhos.Authorization = `Bearer ${lerToken()}`;

  let resposta;
  try {
    resposta = await fetch(`${BASE_API}${caminho}`, {
      method: metodo,
      headers: cabecalhos,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error(MENSAGENS.SERVIDOR_INDISPONIVEL);
  }

  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.erro || MENSAGENS.ERRO_INESPERADO);
  }
  return dados;
}
