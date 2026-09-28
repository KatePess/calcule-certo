import { makeAutoObservable, runInAction } from 'mobx';
import { taxaServico } from '../servicos/taxaServico.js';

// Taxas salvas (classe TaxaCustomizada): gerenciadas no Perfil e usadas
// para preencher campos na tela de calculo.
export class TaxaStore {
  taxas = [];
  carregado = false;
  carregando = false;
  erro = '';

  constructor() {
    makeAutoObservable(this);
  }

  porTipo(tipo) {
    return this.taxas.filter((taxa) => taxa.tipo === tipo);
  }

  async carregar() {
    this.carregando = true;
    this.erro = '';
    try {
      const { taxas } = await taxaServico.listar();
      runInAction(() => {
        this.taxas = taxas;
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

  carregarSeNecessario() {
    if (!this.carregado && !this.carregando) this.carregar();
  }

  async salvar(dados, id) {
    if (id) await taxaServico.atualizar(id, dados);
    else await taxaServico.cadastrar(dados);
    await this.carregar();
  }

  async excluir(id) {
    await taxaServico.excluir(id);
    await this.carregar();
  }

  limpar() {
    this.taxas = [];
    this.carregado = false;
    this.erro = '';
  }
}
