import { useEffect, useId, useRef } from 'react';
import { IconeFechar } from './Icones.jsx';

// Janela sobreposta. Fecha com Esc, com o X ou clicando fora dela.
export default function Modal({ titulo, aoFechar, children, rodape, largura = 'media' }) {
  const idTitulo = useId();
  const caixa = useRef(null);

  // Guarda a funcao mais recente sem refazer o efeito a cada renderizacao;
  // senao o foco pularia para a caixa enquanto a pessoa digita.
  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;

  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === 'Escape') fechar.current();
    }
    document.addEventListener('keydown', aoTeclar);
    // Respeita um campo com autoFocus que ja tenha recebido o foco.
    if (!caixa.current?.contains(document.activeElement)) caixa.current?.focus();
    return () => document.removeEventListener('keydown', aoTeclar);
  }, []);

  return (
    <div className="modal" onMouseDown={(evento) => evento.target === evento.currentTarget && fechar.current()}>
      <div
        className={`modal__caixa modal__caixa--${largura}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titulo ? idTitulo : undefined}
        tabIndex={-1}
        ref={caixa}
      >
        <button type="button" className="modal__fechar" aria-label="Fechar" onClick={() => fechar.current()}>
          <IconeFechar tamanho={20} />
        </button>
        {titulo && (
          <h2 className="modal__titulo" id={idTitulo}>
            {titulo}
          </h2>
        )}
        <div className="modal__corpo">{children}</div>
        {rodape && <div className="modal__rodape">{rodape}</div>}
      </div>
    </div>
  );
}
