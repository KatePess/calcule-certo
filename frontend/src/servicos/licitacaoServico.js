import { ENDPOINTS, METODOS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

export const licitacaoServico = {
  listar({ pagina, limite, status, busca } = {}) {
    return requisitar(ENDPOINTS.LICITACOES, {
      autenticado: true,
      parametros: { pagina, limite, status, busca },
    });
  },

  cadastrar(dados) {
    return requisitar(ENDPOINTS.LICITACOES, { metodo: METODOS.POST, corpo: dados, autenticado: true });
  },

  atualizar(id, dados) {
    return requisitar(ENDPOINTS.licitacao(id), { metodo: METODOS.PUT, corpo: dados, autenticado: true });
  },

  atualizarStatus(id, status) {
    return requisitar(ENDPOINTS.statusLicitacao(id), {
      metodo: METODOS.PATCH,
      corpo: { status },
      autenticado: true,
    });
  },

  excluir(id) {
    return requisitar(ENDPOINTS.licitacao(id), { metodo: METODOS.DELETE, autenticado: true });
  },
};
