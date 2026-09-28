import { ENDPOINTS } from '../constantes/api.js';
import { requisitar } from './httpCliente.js';

export const painelServico = {
  // Envia o fuso do navegador para que "hoje" nos alertas seja o dia de quem usa.
  obter() {
    return requisitar(ENDPOINTS.PAINEL, {
      autenticado: true,
      parametros: { fuso: Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
  },
};
