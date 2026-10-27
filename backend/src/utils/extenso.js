// Valor em reais por extenso, como nas propostas de licitacao e nos cheques:
// "11299.09" -> "onze mil, duzentos e noventa e nove reais e nove centavos".
// Recebe texto com duas casas (formato da API), sem passar por number.

const UNIDADES = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove',
];
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
const CENTENAS = [
  '', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos',
  'seiscentos', 'setecentos', 'oitocentos', 'novecentos',
];
// Do maior para o menor: [singular, plural]. O grupo das unidades nao tem nome.
const GRUPOS = [
  ['bilhão', 'bilhões'],
  ['milhão', 'milhões'],
  ['mil', 'mil'],
  ['', ''],
];

// 0 a 999 por extenso ("" para zero).
function ate999(numero) {
  if (numero === 100) return 'cem';
  const centena = Math.floor(numero / 100);
  const resto = numero % 100;
  const partes = [];
  if (centena) partes.push(CENTENAS[centena]);
  if (resto >= 20) {
    const unidade = resto % 10;
    partes.push(unidade ? `${DEZENAS[Math.floor(resto / 10)]} e ${UNIDADES[unidade]}` : DEZENAS[Math.floor(resto / 10)]);
  } else if (resto) {
    partes.push(UNIDADES[resto]);
  }
  return partes.join(' e ');
}

// Inteiro (em texto, para nao perder precisao) por extenso.
function inteiroPorExtenso(texto) {
  const digitos = texto.replace(/^0+/, '').padStart(GRUPOS.length * 3, '0');
  const grupos = GRUPOS.map((_, indice) => Number(digitos.slice(indice * 3, indice * 3 + 3)));

  const nomes = grupos.map((valor, indice) => {
    if (!valor) return null;
    const [singular, plural] = GRUPOS[indice];
    // "mil", e nao "um mil".
    if (singular === 'mil' && valor === 1) return 'mil';
    return [ate999(valor), valor === 1 ? singular : plural].filter(Boolean).join(' ');
  });

  const preenchidos = nomes.map((nome, indice) => ({ nome, valor: grupos[indice] })).filter((g) => g.nome);
  // Liga com "e" quando o ultimo grupo e redondo ou menor que cem
  // ("mil e quinhentos", "dois mil e vinte"); senao, com virgula.
  return preenchidos.reduce((frase, grupo, indice) => {
    if (indice === 0) return grupo.nome;
    const ultimo = indice === preenchidos.length - 1;
    const liga = ultimo && (grupo.valor < 100 || grupo.valor % 100 === 0) ? ' e ' : ', ';
    return frase + liga + grupo.nome;
  }, '');
}

export function valorPorExtenso(valor) {
  const [inteiro, decimal = '00'] = String(valor).replace(/^-/, '').split('.');
  const centavos = Number(decimal.padEnd(2, '0').slice(0, 2));
  const reaisTexto = inteiroPorExtenso(inteiro);
  const partes = [];

  if (reaisTexto) {
    // "um milhão de reais", mas "um milhão e cem reais".
    const soMilhoes = /(milhão|milhões|bilhão|bilhões)$/.test(reaisTexto);
    const moeda = reaisTexto === 'um' ? 'real' : 'reais';
    partes.push(`${reaisTexto}${soMilhoes ? ' de' : ''} ${moeda}`);
  }
  if (centavos) partes.push(`${ate999(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`);

  return partes.length ? partes.join(' e ') : 'zero real';
}
