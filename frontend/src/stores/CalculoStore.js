import { makeAutoObservable, runInAction } from 'mobx';
import {
  CALCULO_VAZIO,
  CAMPOS_OBRIGATORIOS,
  LIMITE_SELETOR_LICITACOES,
  QUANTIDADE_MAXIMA,
  ROTULOS_CALCULO,
} from '../constantes/calculo.js';
import { VALIDACAO } from '../constantes/mensagens.js';
import { calculoServico } from '../servicos/calculoServico.js';
import { licitacaoServico } from '../servicos/licitacaoServico.js';
import { moedaParaApi, percentualParaApi } from '../utils/moeda.js';
import { estaPreenchido, primeiroErro } from '../utils/validadores.js';

// Estado da tela "Novo calculo de licitacao" (Figuras C1 e C2).
// O formulario fica no formato da tela ("1.266,67"); a conversao para o
// formato da API acontece so em montarPayload().
export class CalculoStore {
  form = { ...CALCULO_VAZIO };
  taxasAdicionais = [];
  licitacaoId = '';
  licitacoes = [];
  carregandoLicitacoes = false;

  resultado = null;
  avisos = [];
  simulando = false;
  salvando = false;
  erro = '';
  erroResumo = '';
  salvo = null;

  constructor() {
    makeAutoObservable(this);
  }

  get licitacaoSelecionada() {
    return this.licitacoes.find((licitacao) => String(licitacao.id) === this.licitacaoId) ?? null;
  }

  alterar(campo, valor) {
    this.form[campo] = valor;
  }

  selecionarLicitacao(id) {
    this.licitacaoId = id ? String(id) : '';
  }

  adicionarTaxa(nome = '', percentual = '') {
    this.taxasAdicionais.push({ nome, percentual });
  }

  alterarTaxa(indice, campo, valor) {
    this.taxasAdicionais[indice][campo] = valor;
  }

  removerTaxa(indice) {
    this.taxasAdicionais.splice(indice, 1);
  }

  // Antecipa na tela os erros mais comuns; o servidor valida tudo de novo.
  validar() {
    const quantidade = Number(this.form.quantidadeItens);
    return primeiroErro([
      [Boolean(this.licitacaoId), VALIDACAO.CALCULO_LICITACAO],
      ...CAMPOS_OBRIGATORIOS.map((campo) => [
        estaPreenchido(this.form[campo]),
        VALIDACAO.CALCULO_OBRIGATORIO(ROTULOS_CALCULO[campo]),
      ]),
      [Number.isInteger(quantidade) && quantidade >= 1 && quantidade <= QUANTIDADE_MAXIMA, VALIDACAO.CALCULO_QUANTIDADE],
      [
        this.taxasAdicionais.every((taxa) => estaPreenchido(taxa.nome) && estaPreenchido(taxa.percentual)),
        VALIDACAO.TAXA_ADICIONAL,
      ],
    ]);
  }

  montarPayload() {
    const { form } = this;
    return {
      licitacaoId: Number(this.licitacaoId),
      orcamentoEmpresa: moedaParaApi(form.orcamentoEmpresa),
      quantidadeItens: form.quantidadeItens,
      custoFixo: moedaParaApi(form.custoFixo),
      custoVariavel: moedaParaApi(form.custoVariavel),
      seguro: moedaParaApi(form.seguro),
      taxaPlataforma: percentualParaApi(form.taxaPlataforma),
      comissaoTerceiros: percentualParaApi(form.comissaoTerceiros),
      margemLucro: percentualParaApi(form.margemLucro),
      taxasAdicionais: this.taxasAdicionais.map((taxa) => ({
        nome: taxa.nome.trim(),
        percentual: percentualParaApi(taxa.percentual),
      })),
    };
  }

  async carregarLicitacoes() {
    this.carregandoLicitacoes = true;
    try {
      const { itens } = await licitacaoServico.listar({ limite: LIMITE_SELETOR_LICITACOES });
      runInAction(() => {
        this.licitacoes = itens;
        // Se ainda nao ha escolha e so existe uma licitacao, ja seleciona.
        if (!this.licitacaoId && itens.length === 1) this.licitacaoId = String(itens[0].id);
      });
    } catch (falha) {
      runInAction(() => {
        this.erro = falha.message;
      });
    } finally {
      runInAction(() => {
        this.carregandoLicitacoes = false;
      });
    }
  }

  async criarLicitacao(dados) {
    const { licitacao } = await licitacaoServico.cadastrar(dados);
    await this.carregarLicitacoes();
    this.selecionarLicitacao(licitacao.id);
  }

  // "Confirmar" (Figura C1): calcula no servidor sem salvar.
  async simular() {
    const problema = this.validar();
    if (problema) {
      this.erro = problema;
      return;
    }
    this.erro = '';
    this.simulando = true;
    try {
      const { resultado, avisos } = await calculoServico.simular(this.montarPayload());
      runInAction(() => {
        this.resultado = resultado;
        this.avisos = avisos;
        this.erroResumo = '';
      });
    } catch (falha) {
      runInAction(() => {
        this.erro = falha.message;
      });
    } finally {
      runInAction(() => {
        this.simulando = false;
      });
    }
  }

  // "Atualizar calculo" (Figura C2): fecha o resumo e volta ao formulario.
  voltarParaEdicao() {
    this.resultado = null;
    this.avisos = [];
    this.erroResumo = '';
  }

  // "Salvar em Relatorios" (Figura C2). O servidor recalcula antes de gravar.
  async salvar() {
    this.salvando = true;
    this.erroResumo = '';
    try {
      const { calculo, relatorioId } = await calculoServico.salvar(this.montarPayload());
      runInAction(() => {
        this.salvo = { calculo, relatorioId };
        this.resultado = null;
      });
    } catch (falha) {
      runInAction(() => {
        this.erroResumo = falha.message;
      });
    } finally {
      runInAction(() => {
        this.salvando = false;
      });
    }
  }

  // Limpa o formulario para um novo calculo, mantendo a licitacao escolhida.
  novoCalculo() {
    this.form = { ...CALCULO_VAZIO };
    this.taxasAdicionais = [];
    this.resultado = null;
    this.avisos = [];
    this.salvo = null;
    this.erro = '';
    this.erroResumo = '';
  }

  limpar() {
    this.novoCalculo();
    this.licitacaoId = '';
    this.licitacoes = [];
  }
}
