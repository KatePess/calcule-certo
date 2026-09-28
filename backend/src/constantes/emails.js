// Textos dos e-mails enviados pelo sistema. A montagem em texto e HTML fica
// em utils/email.js.
export const EMAIL_RECUPERACAO = {
  ASSUNTO: 'Calcule Certo: redefinir sua senha',
  saudacao: (nome) => `Olá, ${nome}!`,
  PEDIDO: 'Recebemos um pedido para redefinir a senha da sua conta no Calcule Certo.',
  instrucao: (minutos) => `Para criar uma nova senha, abra o link abaixo em até ${minutos} minutos.`,
  BOTAO: 'Criar nova senha',
  LINK_ALTERNATIVO: 'Se o botão não funcionar, copie este endereço no navegador:',
  IGNORAR: 'Se você não fez este pedido, ignore este e-mail: sua senha continua a mesma.',
};

export const ASSINATURA_EMAIL = 'Calcule Certo';
