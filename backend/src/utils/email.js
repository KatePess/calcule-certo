import nodemailer from 'nodemailer';
import { AMBIENTE } from '../config/ambiente.js';
import { ASSINATURA_EMAIL } from '../constantes/emails.js';

// A porta 465 usa SSL desde o inicio; as outras (587) usam STARTTLS.
const PORTA_SMTP_SSL = 465;
const LIMITE_CAIXA_DE_SAIDA = 20;

// E-mails que nao sairam por falta de SMTP (desenvolvimento e testes).
// Os testes leem daqui o link enviado.
export const caixaDeSaida = [];

let transporte = null;

function obterTransporte() {
  if (!transporte) {
    const { host, porta, usuario, senha } = AMBIENTE.SMTP;
    transporte = nodemailer.createTransport({
      host,
      port: porta,
      secure: porta === PORTA_SMTP_SSL,
      auth: usuario ? { user: usuario, pass: senha } : undefined,
    });
  }
  return transporte;
}

function escaparHtml(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// Monta o e-mail em texto puro e em HTML a partir dos mesmos textos. Tudo
// passa por escaparHtml: o nome da pessoa, por exemplo, e digitado por ela.
export function montarEmail({ paragrafos, link, rodape }) {
  const texto = [...paragrafos, link.url, rodape, ASSINATURA_EMAIL].join('\n\n');

  const url = escaparHtml(link.url);
  const html = `<div style="font-family:Arial,sans-serif;color:#0f2340;max-width:520px;line-height:1.5">
${paragrafos.map((paragrafo) => `<p>${escaparHtml(paragrafo)}</p>`).join('\n')}
<p><a href="${url}" style="display:inline-block;padding:12px 22px;background:#2f7bff;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:bold">${escaparHtml(link.rotulo)}</a></p>
<p style="font-size:13px;color:#5b6b82">${escaparHtml(link.alternativo)}<br>${url}</p>
<p style="font-size:13px;color:#5b6b82">${escaparHtml(rodape)}</p>
<p><strong>${escaparHtml(ASSINATURA_EMAIL)}</strong></p>
</div>`;

  return { texto, html };
}

function guardarSemEnviar(mensagem) {
  // Em producao, o link nunca pode parar no log.
  if (AMBIENTE.PRODUCAO) {
    console.error(`SMTP não configurado: o e-mail "${mensagem.assunto}" não foi enviado.`);
    return;
  }

  caixaDeSaida.push(mensagem);
  if (caixaDeSaida.length > LIMITE_CAIXA_DE_SAIDA) caixaDeSaida.shift();

  if (!AMBIENTE.TESTE) {
    const linha = '-'.repeat(64);
    console.log(
      `\n${linha}\nE-mail NÃO enviado (SMTP não configurado). Conteúdo:\n` +
        `Para: ${mensagem.para}\nAssunto: ${mensagem.assunto}\n\n${mensagem.texto}\n${linha}\n`,
    );
  }
}

export async function enviarEmail({ para, assunto, texto, html }) {
  if (!AMBIENTE.SMTP.host) {
    guardarSemEnviar({ para, assunto, texto, html });
    return;
  }
  await obterTransporte().sendMail({ from: AMBIENTE.SMTP.remetente, to: para, subject: assunto, text: texto, html });
}
