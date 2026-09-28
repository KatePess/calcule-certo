import { observer } from 'mobx-react-lite';
import { TAXAS_ADICIONAIS_MAXIMO } from '../constantes/calculo.js';
import { TAMANHO_MAXIMO_NOME_TAXA, TIPOS_TAXA } from '../constantes/taxa.js';
import { useCalculoStore } from '../stores/index.jsx';
import { apiParaPercentual, mascararPercentual } from '../utils/moeda.js';
import { IconeFechar, IconeMais } from './Icones.jsx';
import SeletorTaxaSalva from './SeletorTaxaSalva.jsx';

// Outras taxas cobradas sobre o preco final, alem da plataforma e da
// comissao (ex.: taxa bancaria). Entram na soma dos percentuais do calculo.
export default observer(function TaxasAdicionais() {
  const calculo = useCalculoStore();
  const cheio = calculo.taxasAdicionais.length >= TAXAS_ADICIONAIS_MAXIMO;

  return (
    <div className="taxas-adicionais">
      <p className="taxas-adicionais__titulo">Taxas adicionais (opcional)</p>

      {calculo.taxasAdicionais.map((taxa, indice) => (
        // A posicao serve de chave porque os campos sao controlados pela store:
        // ao remover uma linha, cada campo volta a mostrar o valor certo.
        <div key={indice} className="taxas-adicionais__linha">
          <input
            className="taxas-adicionais__nome"
            value={taxa.nome}
            maxLength={TAMANHO_MAXIMO_NOME_TAXA}
            placeholder="Nome da taxa"
            aria-label={`Nome da taxa adicional ${indice + 1}`}
            onChange={(e) => calculo.alterarTaxa(indice, 'nome', e.target.value)}
          />
          <div className="campo-calculo__caixa taxas-adicionais__percentual">
            <input
              inputMode="decimal"
              value={taxa.percentual}
              placeholder="0"
              aria-label={`Percentual da taxa adicional ${indice + 1}`}
              onChange={(e) => calculo.alterarTaxa(indice, 'percentual', mascararPercentual(e.target.value))}
            />
            <span className="campo-calculo__marca campo-calculo__marca--fim">%</span>
          </div>
          <button
            type="button"
            className="botao-icone botao-icone--perigo"
            aria-label={`Remover taxa adicional ${indice + 1}`}
            onClick={() => calculo.removerTaxa(indice)}
          >
            <IconeFechar tamanho={16} />
          </button>
        </div>
      ))}

      {!cheio && (
        <div className="taxas-adicionais__acoes">
          <button type="button" className="taxas-adicionais__incluir" onClick={() => calculo.adicionarTaxa()}>
            <IconeMais tamanho={14} /> Adicionar taxa
          </button>
          <SeletorTaxaSalva
            tipo={TIPOS_TAXA.ADICIONAL}
            rotulo="Incluir taxa salva"
            aoEscolher={(taxa) => calculo.adicionarTaxa(taxa.nome, apiParaPercentual(taxa.percentual))}
          />
        </div>
      )}
    </div>
  );
});
