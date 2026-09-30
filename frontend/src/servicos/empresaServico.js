import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

// Uma empresa por conta: sempre a de quem esta logado.
export const empresaServico = {
  obter() {
    return requisitar(ENDPOINTS.EMPRESA, { autenticado: true });
  },

  salvar(dados) {
    return requisitar(ENDPOINTS.EMPRESA, { metodo: METODOS.PUT, corpo: dados, autenticado: true });
  },
};
