import { AMBIENTE } from '../config/ambiente.js';
import { EMAIL_RECUPERACAO } from '../constantes/emails.js';
import { STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import {
  CAMINHO_TELA_REDEFINIR,
  INTERVALO_ENTRE_PEDIDOS_SEGUNDOS,
  VALIDADE_LINK_MINUTOS,
} from '../constantes/recuperacaoSenha.js';
import { transacao } from '../db.js';
import { tokenRecuperacaoRepositorio } from '../repositorios/tokenRecuperacaoRepositorio.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { enviarEmail, montarEmail } from '../utils/email.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { emailNormalizado } from '../utils/formatadores.js';
import { gerarHash } from '../utils/senha.js';
import { gerarTokenRecuperacao, hashDoTokenRecuperacao } from '../utils/tokenRecuperacao.js';
import { ehEmailValido, ehSenhaValida } from '../utils/validadores.js';

function mensagemDeRecuperacao(usuario, token) {
  const url = `${AMBIENTE.URL_FRONT}${CAMINHO_TELA_REDEFINIR}?token=${token}`;
  const primeiroNome = usuario.nome.split(' ')[0];
  return {
    para: usuario.email,
    assunto: EMAIL_RECUPERACAO.ASSUNTO,
    ...montarEmail({
      paragrafos: [
        EMAIL_RECUPERACAO.saudacao(primeiroNome),
        EMAIL_RECUPERACAO.PEDIDO,
        EMAIL_RECUPERACAO.instrucao(VALIDADE_LINK_MINUTOS),
      ],
      link: { url, rotulo: EMAIL_RECUPERACAO.BOTAO, alternativo: EMAIL_RECUPERACAO.LINK_ALTERNATIVO },
      rodape: EMAIL_RECUPERACAO.IGNORAR,
    }),
  };
}

// "Esqueci minha senha": envia um link de uso unico, valido por 30 minutos.
export const recuperacaoSenhaServico = {
  // A resposta e a mesma exista ou nao a conta, para o formulario nao servir
  // para descobrir quais e-mails estao cadastrados.
  async solicitar(dados) {
    const email = emailNormalizado(dados?.email);
    if (!ehEmailValido(email)) throw new ErroDeAplicacao(ERROS.EMAIL_INVALIDO, STATUS.REQUISICAO_INVALIDA);

    const usuario = await usuarioRepositorio.buscarPorEmail(email);
    if (!usuario) return;

    const segundos = await tokenRecuperacaoRepositorio.segundosDesdeUltimoPedido(usuario.id);
    if (segundos !== null && segundos < INTERVALO_ENTRE_PEDIDOS_SEGUNDOS) return;

    const { token, hash } = gerarTokenRecuperacao();
    await tokenRecuperacaoRepositorio.substituir(usuario.id, hash, VALIDADE_LINK_MINUTOS);

    // Sem await: esperar o servidor de e-mail deixaria a resposta mais lenta
    // so quando a conta existe, e isso tambem revelaria o cadastro.
    enviarEmail(mensagemDeRecuperacao(usuario, token)).catch((erro) => {
      console.error('Falha ao enviar o e-mail de recuperação de senha:', erro.message);
    });
  },

  async redefinir(dados) {
    const token = String(dados?.token ?? '');
    const novaSenha = String(dados?.novaSenha ?? '');

    // A senha e conferida antes de gastar o link: um erro de digitacao nao o invalida.
    if (!ehSenhaValida(novaSenha)) throw new ErroDeAplicacao(ERROS.SENHA_CURTA, STATUS.REQUISICAO_INVALIDA);
    if (!token) throw new ErroDeAplicacao(ERROS.LINK_RECUPERACAO_INVALIDO, STATUS.REQUISICAO_INVALIDA);

    const senhaHash = await gerarHash(novaSenha);
    await transacao(async (cliente) => {
      const usuarioId = await tokenRecuperacaoRepositorio.consumir(hashDoTokenRecuperacao(token), cliente);
      if (!usuarioId) throw new ErroDeAplicacao(ERROS.LINK_RECUPERACAO_INVALIDO, STATUS.REQUISICAO_INVALIDA);
      await usuarioRepositorio.atualizarSenha(usuarioId, senhaHash, cliente);
    });
  },
};
