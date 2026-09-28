import { makeAutoObservable, runInAction } from 'mobx';
import { LIMITE_SELETOR_LICITACOES } from '../constantes/calculo.js';
import { licitacaoServico } from '../servicos/licitacaoServico.js';
import { relatorioServico } from '../servicos/relatorioServico.js';
import { salvarArquivo } from '../utils/arquivo.js';
import { inicioDosUltimosDias } from '../utils/datas.js';

const ESTADO_INICIAL = {
  itens: [],
  pagina: 1,
  totalPaginas: 1,
  total: 0,
  filtros: { dias: '', licitacaoId: '' },
  licitacoes: [],
  carregando: false,
  erro: '',
  baixando: null,
};

// Central de relatorios (Figura C3): lista, filtros, download e exclusao.
export class RelatorioStore {
  constructor() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
    makeAutoObservable(this);
  }

  get temFiltro() {
    return Boolean(this.filtros.dias || this.filtros.licitacaoId);
  }

  async carregar(pagina = this.pagina) {
    this.carregando = true;
    this.erro = '';
    try {
      const resposta = await relatorioServico.listar({
        pagina,
        de: this.filtros.dias ? inicioDosUltimosDias(Number(this.filtros.dias)) : undefined,
        licitacaoId: this.filtros.licitacaoId || undefined,
      });
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

  // Licitacoes para o filtro. Falha aqui nao impede ver os relatorios.
  async carregarLicitacoes() {
    try {
      const { itens } = await licitacaoServico.listar({ limite: LIMITE_SELETOR_LICITACOES });
      runInAction(() => {
        this.licitacoes = itens;
      });
    } catch {
      // o filtro por licitacao so fica vazio
    }
  }

  filtrar(campo, valor) {
    this.filtros[campo] = valor;
    return this.carregar(1);
  }

  async baixar(relatorio) {
    this.baixando = relatorio.id;
    this.erro = '';
    try {
      const { arquivo, nome } = await relatorioServico.baixarPdf(relatorio.id);
      salvarArquivo(arquivo, nome);
      runInAction(() => {
        // Primeiro download: o botao passa de "Baixar" para "Feito".
        const item = this.itens.find((i) => i.id === relatorio.id);
        if (item && !item.baixadoEm) item.baixadoEm = new Date().toISOString();
      });
    } catch (falha) {
      runInAction(() => {
        this.erro = falha.message;
      });
    } finally {
      runInAction(() => {
        this.baixando = null;
      });
    }
  }

  async excluir(id) {
    await relatorioServico.excluir(id);
    const pagina = this.itens.length === 1 && this.pagina > 1 ? this.pagina - 1 : this.pagina;
    await this.carregar(pagina);
  }

  limpar() {
    Object.assign(this, structuredClone(ESTADO_INICIAL));
  }
}
