import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

export const taxaServico = {
  listar() {
    return requisitar(ENDPOINTS.TAXAS, { autenticado: true });
  },

  cadastrar(dados) {
    return requisitar(ENDPOINTS.TAXAS, { metodo: METODOS.POST, corpo: dados, autenticado: true });
  },

  atualizar(id, dados) {
    return requisitar(ENDPOINTS.taxa(id), { metodo: METODOS.PUT, corpo: dados, autenticado: true });
  },

  excluir(id) {
    return requisitar(ENDPOINTS.taxa(id), { metodo: METODOS.DELETE, autenticado: true });
  },
};
