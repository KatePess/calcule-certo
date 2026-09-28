// Leitura dos valores numericos que chegam do cliente. Aceita texto com ponto
// decimal ("1266.67") ou numero JSON, e recusa tudo que nao couber no banco.
// Usado pelo calculo e pelas taxas salvas, para a regra ficar num lugar so.
import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { Dec } from './dinheiro.js';
import { ErroDeAplicacao } from './ErroDeAplicacao.js';

const FORMATO_DINHEIRO = /^\d{1,12}(\.\d{1,2})?$/;
const FORMATO_PERCENTUAL = /^\d{1,3}(\.\d{1,4})?$/;

function invalido(mensagem) {
  return new ErroDeAplicacao(mensagem, STATUS.REQUISICAO_INVALIDA);
}

export function lerTexto(valor) {
  return valor === undefined || valor === null ? '' : String(valor).trim();
}

// Valor em reais com ate 2 casas. Vazio devolve null quando nao e obrigatorio.
export function lerDinheiro(valor, rotulo, { obrigatorio = true } = {}) {
  const texto = lerTexto(valor);
  if (texto === '') {
    if (obrigatorio) throw invalido(ERROS.CALCULO_CAMPO_OBRIGATORIO(rotulo));
    return null;
  }
  if (texto.startsWith('-')) throw invalido(ERROS.CALCULO_VALOR_NEGATIVO(rotulo));
  if (!FORMATO_DINHEIRO.test(texto)) throw invalido(ERROS.CALCULO_VALOR_INVALIDO(rotulo));
  return new Dec(texto);
}

// Percentual com ate 4 casas. A regra "menor que 100%" e conferida por quem
// usa o valor (motor de calculo ou servico de taxas).
export function lerPercentual(valor, rotulo) {
  const texto = lerTexto(valor);
  if (texto === '') throw invalido(ERROS.CALCULO_CAMPO_OBRIGATORIO(rotulo));
  if (texto.startsWith('-')) throw invalido(ERROS.CALCULO_PERCENTUAL_FORA(rotulo));
  if (!FORMATO_PERCENTUAL.test(texto)) throw invalido(ERROS.CALCULO_PERCENTUAL_INVALIDO(rotulo));
  return new Dec(texto);
}
