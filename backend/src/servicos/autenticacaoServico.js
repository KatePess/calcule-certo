import { CODIGO_PG_DUPLICADO, STATUS } from '../constantes/http.js';
import { ERROS } from '../constantes/mensagens.js';
import { usuarioRepositorio } from '../repositorios/usuarioRepositorio.js';
import { ErroDeAplicacao } from '../utils/ErroDeAplicacao.js';
import { apenasDigitos, emailNormalizado, textoLimpo, usuarioPublico } from '../utils/formatadores.js';
import { conferirSenha, gerarHash } from '../utils/senha.js';
import { gerarToken } from '../utils/token.js';
import {
  ehCnpjValido,
  ehEmailValido,
  ehNomeValido,
  ehSenhaValida,
} from '../utils/validadores.js';

// Regras de negocio da autenticacao. Corresponde aos metodos cadastrar() e
// autenticar() da classe Usuario no diagrama de classes do TCC.
export const autenticacaoServico = {
  async cadastrar(dadosRecebidos) {
    const nome = textoLimpo(dadosRecebidos?.nome);
    const email = emailNormalizado(dadosRecebidos?.email);
    const senha = String(dadosRecebidos?.senha ?? '');
    const cnpj = apenasDigitos(dadosRecebidos?.cnpj);

    if (!ehNomeValido(nome)) {
      throw new ErroDeAplicacao(ERROS.NOME_INVALIDO, STATUS.REQUISICAO_INVALIDA);
    }
    if (!ehEmailValido(email)) {
      throw new ErroDeAplicacao(ERROS.EMAIL_INVALIDO, STATUS.REQUISICAO_INVALIDA);
    }
    if (!ehSenhaValida(senha)) {
      throw new ErroDeAplicacao(ERROS.SENHA_CURTA, STATUS.REQUISICAO_INVALIDA);
    }
    if (!ehCnpjValido(cnpj)) {
      throw new ErroDeAplicacao(ERROS.CNPJ_INVALIDO, STATUS.REQUISICAO_INVALIDA);
    }

    try {
      const senhaHash = await gerarHash(senha);
      const usuario = await usuarioRepositorio.inserir({ nome, email, senhaHash, cnpj });
      return { usuario: usuarioPublico(usuario), token: gerarToken(usuario) };
    } catch (erro) {
      if (erro.code === CODIGO_PG_DUPLICADO) {
        throw new ErroDeAplicacao(ERROS.EMAIL_JA_CADASTRADO, STATUS.CONFLITO);
      }
      console.error(erro);
      throw new ErroDeAplicacao(ERROS.FALHA_CADASTRO, STATUS.ERRO_INTERNO);
    }
  },

  async autenticar(dadosRecebidos) {
    const email = emailNormalizado(dadosRecebidos?.email);
    const senha = String(dadosRecebidos?.senha ?? '');

    if (!email || !senha) {
      throw new ErroDeAplicacao(ERROS.CAMPOS_LOGIN_VAZIOS, STATUS.REQUISICAO_INVALIDA);
    }

    let usuario;
    try {
      usuario = await usuarioRepositorio.buscarPorEmail(email);
    } catch (erro) {
      console.error(erro);
      throw new ErroDeAplicacao(ERROS.FALHA_LOGIN, STATUS.ERRO_INTERNO);
    }

    const senhaConfere = usuario && (await conferirSenha(senha, usuario.senha_hash));
    if (!senhaConfere) {
      throw new ErroDeAplicacao(ERROS.CREDENCIAIS_INVALIDAS, STATUS.NAO_AUTORIZADO);
    }

    return { usuario: usuarioPublico(usuario), token: gerarToken(usuario) };
  },

  // O CNPJ so muda se vier na requisicao: a tela "Dados pessoais" manda so o
  // nome, e o CNPJ passou a ser editado em "Dados da empresa".
  async atualizarPerfil(usuarioId, dados) {
    const nome = textoLimpo(dados?.nome);
    if (!ehNomeValido(nome)) throw new ErroDeAplicacao(ERROS.NOME_INVALIDO, STATUS.REQUISICAO_INVALIDA);

    let usuario;
    if (dados?.cnpj === undefined) {
      usuario = await usuarioRepositorio.atualizarNome(usuarioId, nome);
    } else {
      const cnpj = apenasDigitos(dados.cnpj);
      if (!ehCnpjValido(cnpj)) throw new ErroDeAplicacao(ERROS.CNPJ_INVALIDO, STATUS.REQUISICAO_INVALIDA);
      usuario = await usuarioRepositorio.atualizarPerfil(usuarioId, { nome, cnpj });
    }
    if (!usuario) throw new ErroDeAplicacao(ERROS.USUARIO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO);
    return usuarioPublico(usuario);
  },

  // Exige a senha atual: quem pegou um computador com a sessao aberta nao
  // consegue trocar a senha da pessoa.
  async trocarSenha(usuarioId, dados) {
    const senhaAtual = String(dados?.senhaAtual ?? '');
    const novaSenha = String(dados?.novaSenha ?? '');
    if (!senhaAtual) throw new ErroDeAplicacao(ERROS.SENHA_ATUAL_VAZIA, STATUS.REQUISICAO_INVALIDA);
    if (!ehSenhaValida(novaSenha)) throw new ErroDeAplicacao(ERROS.SENHA_CURTA, STATUS.REQUISICAO_INVALIDA);
    if (novaSenha === senhaAtual) throw new ErroDeAplicacao(ERROS.SENHA_NOVA_IGUAL, STATUS.REQUISICAO_INVALIDA);

    const hashAtual = await usuarioRepositorio.buscarHashPorId(usuarioId);
    if (!hashAtual || !(await conferirSenha(senhaAtual, hashAtual))) {
      throw new ErroDeAplicacao(ERROS.SENHA_ATUAL_INCORRETA, STATUS.REQUISICAO_INVALIDA);
    }
    await usuarioRepositorio.atualizarSenha(usuarioId, await gerarHash(novaSenha));
  },

  async buscarUsuarioLogado(id) {
    const usuario = await usuarioRepositorio.buscarPorId(id);
    if (!usuario) {
      throw new ErroDeAplicacao(ERROS.USUARIO_NAO_ENCONTRADO, STATUS.NAO_ENCONTRADO);
    }
    return usuario;
  },
};
