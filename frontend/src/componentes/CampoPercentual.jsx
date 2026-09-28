import { mascararPercentual } from '../utils/moeda.js';

// Campo de percentual: aceita "10" ou "12,5", sempre menor que 100.
export default function CampoPercentual({ id, rotulo, valor, aoMudar, ajuda, placeholder = '0', acessorio }) {
  return (
    <div className="campo-calculo">
      <label htmlFor={id}>{rotulo}</label>
      <div className="campo-calculo__caixa">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={valor}
          placeholder={placeholder}
          onChange={(evento) => aoMudar(mascararPercentual(evento.target.value))}
        />
        <span className="campo-calculo__marca campo-calculo__marca--fim">%</span>
      </div>
      {acessorio}
      {ajuda && <small className="campo-calculo__ajuda">{ajuda}</small>}
    </div>
  );
}
