import { makeAutoObservable, runInAction } from 'mobx';
import { licitacaoServico } from '../servicos/licitacaoServico.js';

const ESTADO_INICIAL = {
  itens: [],
  pagina: 1,
  totalPaginas: 1,
  total: 0,
  filtros: { status: '', busca: '' },
  carregando: false,
  erro: '',
};

// Lista paginada de licitacoes usada pelo Resumo do sistema.
export class LicitacaoStore {
  constructor() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
    makeAutoObservable(this);
  }

  get temFiltro() {
    return Boolean(this.filtros.status || this.filtros.busca);
  }

  async carregar(pagina = this.pagina) {
    this.carregando = true;
    this.erro = '';
    try {
      const resposta = await licitacaoServico.listar({ pagina, ...this.filtros });
      runInAction(() => {
        this.itens = resposta.itens;
        this.pagina = resposta.pagina;
        this.totalPaginas = resposta.totalPaginas;
        this.total = resposta.total;
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

  // Mudar um filtro sempre volta para a primeira pagina.
  filtrar(campo, valor) {
    this.filtros[campo] = valor;
    return this.carregar(1);
  }

  async salvar(dados, id) {
    const resposta = id ? await licitacaoServico.atualizar(id, dados) : await licitacaoServico.cadastrar(dados);
    await this.carregar(id ? this.pagina : 1);
    return resposta.licitacao;
  }

  async excluir(id) {
    await licitacaoServico.excluir(id);
    // Se era o ultimo item da pagina, volta uma pagina.
    const pagina = this.itens.length === 1 && this.pagina > 1 ? this.pagina - 1 : this.pagina;
    await this.carregar(pagina);
  }

  limpar() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
  }
}
