import 'dotenv/config';

const MODO = process.env.NODE_ENV || 'development';

// Leitura centralizada do .env. Nenhum outro arquivo acessa process.env
// diretamente, entao a origem de cada configuracao fica evidente.
export const AMBIENTE = {
  MODO,
  PRODUCAO: MODO === 'production',
  TESTE: MODO === 'test',

  PORTA: Number(process.env.PORTA || 3001),

  BANCO: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'calcule',
    password: process.env.DB_PASSWORD || 'calcule',
    database: process.env.DB_NAME || 'calcule_certo',
  },

  JWT: {
    segredo: process.env.JWT_SEGREDO,
    expiracao: process.env.JWT_EXPIRACAO || '8h',
  },

  // Fuso usado nas datas impressas nos relatorios (Rio Branco, UTC-5).
  FUSO_HORARIO: process.env.FUSO_HORARIO || 'America/Rio_Branco',

  // Endereco do front-end, usado nos links enviados por e-mail.
  URL_FRONT: (process.env.URL_FRONT || 'http://localhost:5173').replace(/\/+$/, ''),

  // Endereco publico desta API. O Google e o LinkedIn devolvem a pessoa para
  // URL_API + /api/auth/social/<provedor>/retorno, que precisa estar
  // cadastrado igualzinho no painel de cada provedor.
  URL_API: (process.env.URL_API || 'http://localhost:3001').replace(/\/+$/, ''),

  // Login social. Sem o ID e o segredo, o botao avisa que nao esta configurado.
  LOGIN_SOCIAL: {
    google: {
      clienteId: process.env.GOOGLE_CLIENT_ID || '',
      segredo: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    linkedin: {
      clienteId: process.env.LINKEDIN_CLIENT_ID || '',
      segredo: process.env.LINKEDIN_CLIENT_SECRET || '',
    },
  },

  // Sem SMTP_HOST o e-mail nao sai: em desenvolvimento ele aparece no terminal.
  SMTP: {
    host: process.env.SMTP_HOST || '',
    porta: Number(process.env.SMTP_PORTA || 587),
    usuario: process.env.SMTP_USUARIO || '',
    senha: process.env.SMTP_SENHA || '',
    remetente: process.env.EMAIL_REMETENTE || 'Calcule Certo <nao-responda@calculecerto.com>',
  },
};

// Valor que vem no .env.example; nunca pode ir para producao.
const SEGREDO_DE_EXEMPLO = 'troque-este-segredo-em-producao';
const TAMANHO_MINIMO_SEGREDO = 32;
const COMANDO_GERAR_SEGREDO = `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`;

// Confere a configuracao antes de a API subir. Erros impedem a subida;
// avisos so aparecem no terminal. Recebe o ambiente por parametro para os
// testes poderem conferir cada regra.
export function conferirAmbiente(ambiente = AMBIENTE) {
  const erros = [];
  const avisos = [];
  const { segredo } = ambiente.JWT;

  if (!segredo) {
    erros.push('JWT_SEGREDO não está definido no .env.');
  } else if (ambiente.PRODUCAO && (segredo === SEGREDO_DE_EXEMPLO || segredo.length < TAMANHO_MINIMO_SEGREDO)) {
    erros.push(
      `Em produção, JWT_SEGREDO precisa ser aleatório e ter ao menos ${TAMANHO_MINIMO_SEGREDO} caracteres. ` +
        `Gere um com: ${COMANDO_GERAR_SEGREDO}`,
    );
  }

  if (ambiente.PRODUCAO && !ambiente.SMTP.host) {
    avisos.push('SMTP não configurado: os e-mails de recuperação de senha não serão enviados.');
  }

  return { erros, avisos };
}
