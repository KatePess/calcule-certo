// Enderecos OAuth 2.0 / OpenID Connect de cada provedor. Os dois devolvem os
// dados da pessoa no mesmo formato (sub, name, email, email_verified).
export const PROVEDORES_SOCIAIS = {
  google: {
    nome: 'Google',
    urlAutorizacao: 'https://accounts.google.com/o/oauth2/v2/auth',
    urlToken: 'https://oauth2.googleapis.com/token',
    urlUsuario: 'https://openidconnect.googleapis.com/v1/userinfo',
    escopos: 'openid email profile',
    // Mostra a escolha de conta mesmo com uma so conta Google aberta.
    parametrosExtras: { prompt: 'select_account' },
  },
  linkedin: {
    nome: 'LinkedIn',
    urlAutorizacao: 'https://www.linkedin.com/oauth/v2/authorization',
    urlToken: 'https://www.linkedin.com/oauth/v2/accessToken',
    urlUsuario: 'https://api.linkedin.com/v2/userinfo',
    escopos: 'openid profile email',
    parametrosExtras: {},
  },
};

// O "state" enviado ao provedor vale por 10 minutos: tempo de sobra para a
// pessoa escolher a conta e autorizar.
export const VALIDADE_ESTADO_SOCIAL = '10m';

// Tela do front que recebe o resultado (ver ROTAS.LOGIN_SOCIAL no front-end).
export const CAMINHO_TELA_LOGIN_SOCIAL = '/login/social';
