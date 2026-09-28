import { observer } from 'mobx-react-lite';
import { useTaxaStore } from '../stores/index.jsx';
import { formatarPercentual } from '../utils/moeda.js';

// Lista curta de taxas salvas de um tipo; escolher uma preenche o campo.
// Nao aparece se nao houver taxa salva daquele tipo. `descricao` diz ao
// leitor de tela qual campo sera preenchido quando ha mais de um seletor.
export default observer(function SeletorTaxaSalva({ tipo, aoEscolher, rotulo = 'Usar taxa salva', descricao = rotulo }) {
  const taxas = useTaxaStore();
  const opcoes = taxas.porTipo(tipo);
  if (opcoes.length === 0) return null;

  return (
    <select
      className="seletor-taxa"
      value=""
      aria-label={descricao}
      onChange={(evento) => {
        const escolhida = opcoes.find((taxa) => String(taxa.id) === evento.target.value);
        if (escolhida) aoEscolher(escolhida);
      }}
    >
      <option value="">{rotulo}…</option>
      {opcoes.map((taxa) => (
        <option key={taxa.id} value={taxa.id}>
          {taxa.nome} ({formatarPercentual(taxa.percentual)})
        </option>
      ))}
    </select>
  );
});
