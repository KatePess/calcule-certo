import { makeAutoObservable, runInAction } from 'mobx';
import { empresaServico } from '../servicos/empresaServico.js';

// Dados da empresa, mostrados e editados na tela "Meu perfil".
export class EmpresaStore {
  empresa = null;
  carregando = false;
  erro = '';

  constructor() {
    makeAutoObservable(this);
  }

  async carregar() {
    this.carregando = true;
    this.erro = '';
    try {
      const { empresa } = await empresaServico.obter();
      runInAction(() => {
        this.empresa = empresa;
      });
    } catch (falha) {
      runInAction(() => {
        this.erro = falha.message;
      });
    } finally {
      runInAction(() => {
        this.carregando = false;
      });
    }
  }

  // Deixa o erro para a tela mostrar junto do formulario.
  async salvar(dados) {
    const { empresa } = await empresaServico.salvar(dados);
    runInAction(() => {
      this.empresa = empresa;
    });
  }

  limpar() {
    this.empresa = null;
    this.carregando = false;
    this.erro = '';
  }
}
