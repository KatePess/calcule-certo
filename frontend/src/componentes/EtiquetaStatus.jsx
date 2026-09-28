import { STATUS_LICITACAO } from '../constantes/licitacao.js';
import { Icone } from './Icones.jsx';

// Mostra o status da licitacao com a cor e o icone do prototipo.
export default function EtiquetaStatus({ status, compacta = false }) {
  const info = STATUS_LICITACAO[status];
  if (!info) return null;

  return (
    <span className={`etiqueta etiqueta--${info.tom} ${compacta ? 'etiqueta--compacta' : ''}`}>
      <span className="etiqueta__icone">
        <Icone nome={info.icone} tamanho={13} />
      </span>
      {info.rotulo}
    </span>
  );
}
