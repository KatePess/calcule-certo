import { makeAutoObservable, runInAction } from 'mobx';
import { MENSAGENS } from '../constantes/mensagens.js';
import { autenticacaoServico } from '../servicos/autenticacaoServico.js';
import { aoExpirarSessao } from '../servicos/httpCliente.js';
import { guardarToken, lerToken, limparToken } from '../utils/armazenamento.js';

// Store MobX responsavel pelo estado de autenticacao.
// Qualquer componente marcado com observer() e redesenhado quando
// "usuario" ou "carregando" mudam.
export class SessaoStore {
  usuario = null;
  carregando = true;
  aviso = '';

  // aoEncerrar: chamado quando a sessao termina, para as outras stores
  // apagarem os dados do usuario que saiu.
  constructor(aoEncerrar = () => {}) {
    this.aoEncerrar = aoEncerrar;
    makeAutoObservable(this, { aoEncerrar: false });
    aoExpirarSessao(() => this.encerrar(MENSAGENS.SESSAO_EXPIRADA));
  }

  get estaAutenticado() {
    return this.usuario !== null;
  }

  // Ao abrir o app, recupera a sessao se ja existir um token guardado.
  async restaurarSessao() {
    if (!lerToken()) {
      runInAction(() => {
        this.carregando = false;
      });
      return;
    }

    try {
      const { usuario } = await autenticacaoServico.usuarioLogado();
      runInAction(() => {
        this.usuario = usuario;
      });
    } catch {
      limparToken();
    } finally {
      runInAction(() => {
        this.carregando = false;
      });
    }
  }

  async entrar(email, senha, lembrar) {
    const { usuario, token } = await autenticacaoServico.login(email, senha);
    guardarToken(token, lembrar);
    runInAction(() => {
      this.usuario = usuario;
      this.aviso = '';
    });
  }

  async cadastrar(dadosUsuario) {
    const { usuario, token } = await autenticacaoServico.cadastrar(dadosUsuario);
    guardarToken(token, false);
    runInAction(() => {
      this.usuario = usuario;
      this.aviso = '';
    });
  }

  sair() {
    this.encerrar('');
  }

  encerrar(aviso) {
    limparToken();
    this.usuario = null;
    this.aviso = aviso;
    this.aoEncerrar();
  }
}
