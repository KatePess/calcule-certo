// Ocupa o lugar das telas que ainda serao desenvolvidas, conforme o plano.
export default function EmConstrucao({ titulo, sprint }) {
  return (
    <section className="pagina">
      <h1 className="pagina__titulo">{titulo}</h1>
      <div className="cartao cartao--vazio">
        <p>Esta tela será desenvolvida na Sprint {sprint} do plano de implementação.</p>
      </div>
    </section>
  );
}
