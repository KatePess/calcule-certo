import { createContext, useContext } from 'react';
import { LicitacaoStore } from './LicitacaoStore.js';
import { SessaoStore } from './SessaoStore.js';

// Reune todas as stores da aplicacao.
export class RaizStore {
  constructor() {
    this.licitacoes = new LicitacaoStore();
    // Quando a sessao termina, os dados do usuario anterior sao apagados,
    // para que a proxima pessoa a entrar nao os veja.
    this.sessao = new SessaoStore(() => this.limparDadosDoUsuario());
  }

  limparDadosDoUsuario() {
    this.licitacoes.limpar();
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
