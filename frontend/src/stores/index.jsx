import { createContext, useContext } from 'react';
import { CalculoStore } from './CalculoStore.js';
import { LicitacaoStore } from './LicitacaoStore.js';
import { PainelStore } from './PainelStore.js';
import { RelatorioStore } from './RelatorioStore.js';
import { SessaoStore } from './SessaoStore.js';
import { TaxaStore } from './TaxaStore.js';

// Reune todas as stores da aplicacao.
export class RaizStore {
  constructor() {
    this.licitacoes = new LicitacaoStore();
    this.calculo = new CalculoStore();
    this.relatorios = new RelatorioStore();
    this.painel = new PainelStore();
    this.taxas = new TaxaStore();
    // Quando a sessao termina, os dados do usuario anterior sao apagados,
    // para que a proxima pessoa a entrar nao os veja.
    this.sessao = new SessaoStore(() => this.limparDadosDoUsuario());
  }

  limparDadosDoUsuario() {
    this.licitacoes.limpar();
    this.calculo.limpar();
    this.relatorios.limpar();
    this.painel.limpar();
    this.taxas.limpar();
  }
}

const raizStore = new RaizStore();
const ContextoStore = createContext(raizStore);

export function ProvedorStore({ children }) {
  return <ContextoStore.Provider value={raizStore}>{children}</ContextoStore.Provider>;
}

export function useStores() {
  return useContext(ContextoStore);
}

// Atalhos para as stores mais usadas.
export function useSessaoStore() {
  return useStores().sessao;
}

export function useLicitacaoStore() {
  return useStores().licitacoes;
}

export function useCalculoStore() {
  return useStores().calculo;
}

export function useRelatorioStore() {
  return useStores().relatorios;
}

export function usePainelStore() {
  return useStores().painel;
}

export function useTaxaStore() {
  return useStores().taxas;
}
