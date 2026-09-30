import { makeAutoObservable, runInAction } from 'mobx';
import { painelServico } from '../servicos/painelServico.js';

const ESTADO_INICIAL = {
  licitacoesRecentes: [],
  relatoriosRecentes: [],
  alertas: [],
  totalLicitacoes: 0,
  carregado: false,
  carregando: false,
  erro: '',
};

// Painel inicial (prototipo home-system). Os alertas tambem alimentam o
// contador ao lado de "Home" no menu lateral.
export class PainelStore {
  constructor() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
    makeAutoObservable(this);
  }

  async carregar() {
    this.carregando = true;
    this.erro = '';
    try {
      const dados = await painelServico.obter();
      runInAction(() => {
        this.licitacoesRecentes = dados.licitacoesRecentes;
        this.relatoriosRecentes = dados.relatoriosRecentes;
        this.alertas = dados.alertas;
        this.totalLicitacoes = dados.totalLicitacoes;
        this.carregado = true;
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

  // Usado pelo menu lateral: busca uma vez por sessao; o painel atualiza ao abrir.
  carregarSeNecessario() {
    if (!this.carregado && !this.carregando) this.carregar();
  }

  limpar() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
  }
}
