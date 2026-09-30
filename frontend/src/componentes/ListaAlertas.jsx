import { Link } from 'react-router-dom';
import { TEXTOS_PAINEL } from '../constantes/mensagens.js';
import { ROTAS } from '../constantes/rotas.js';
import { formatarData } from '../utils/formatadores.js';
import { IconeExclamacao } from './Icones.jsx';
import '../estilos/painel.css';

// Licitacoes que abrem nos proximos dias. Aparece no Painel e em
// Perfil > Notificacoes; cada item leva ao Resumo do sistema.
export default function ListaAlertas({ alertas }) {
  return (
    <ul className="painel__lista">
      {alertas.map((alerta) => (
        <li key={alerta.id}>
          <Link to={ROTAS.RESUMO} className="painel__item">
            <span className="painel__item-icone painel__item-icone--vermelho">
              <IconeExclamacao tamanho={20} />
            </span>
            <span className="painel__item-texto">
              Licitação {alerta.numero} · {alerta.orgao} {TEXTOS_PAINEL.quandoAbre(alerta.diasParaAbertura)}
              <small>{formatarData(alerta.dataAbertura)}</small>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
