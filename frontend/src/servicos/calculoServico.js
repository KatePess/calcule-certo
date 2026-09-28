import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

export const calculoServico = {
  // Calcula sem salvar: o resultado alimenta o modal de resumo.
  simular(dados) {
    return requisitar(ENDPOINTS.SIMULAR_CALCULO, { metodo: METODOS.POST, corpo: dados, autenticado: true });
  },

  salvar(dados) {
    return requisitar(ENDPOINTS.CALCULOS, { metodo: METODOS.POST, corpo: dados, autenticado: true });
  },

  obter(id) {
    return requisitar(ENDPOINTS.calculo(id), { autenticado: true });
  },
};
