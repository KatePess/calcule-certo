import { mascararMoeda } from '../utils/moeda.js';

// Campo em reais com mascara de centavos: digitar 126667 mostra 1.266,67.
export default function CampoMoeda({ id, rotulo, valor, aoMudar, ajuda, placeholder = '0,00' }) {
  return (
    <div className="campo-calculo">
      <label htmlFor={id}>{rotulo}</label>
      <div className="campo-calculo__caixa">
        <span className="campo-calculo__marca">R$</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          value={valor}
          placeholder={placeholder}
          onChange={(evento) => aoMudar(mascararMoeda(evento.target.value))}
        />
      </div>
      {ajuda && <small className="campo-calculo__ajuda">{ajuda}</small>}
    </div>
  );
}
