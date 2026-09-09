import { createContext, useContext } from 'react';
import { SessaoStore } from './SessaoStore.js';

// Reune todas as stores da aplicacao. Novas stores (orcamento, relatorios)
// entram aqui nas proximas sprints.
export class RaizStore {
  constructor() {
    this.sessao = new SessaoStore();
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

// Atalho para a store mais usada.
export function useSessaoStore() {
  return useStores().sessao;
}
