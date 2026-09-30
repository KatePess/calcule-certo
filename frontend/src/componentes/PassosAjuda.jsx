// Passo a passo de uso, mostrado no "Ajuda" do menu lateral e do perfil.
export default function PassosAjuda() {
  return (
    <ol className="ajuda">
      <li>Em <b>Resumo do sistema</b>, cadastre a licitação: número, órgão e data de abertura.</li>
      <li>Em <b>Orçamento</b>, escolha a licitação e preencha o custo base e os parâmetros.</li>
      <li>Clique em <b>Confirmar</b> para ver o resumo do cálculo e salve em relatórios.</li>
      <li>Em <b>Relatórios</b>, baixe o PDF pronto para enviar.</li>
    </ol>
  );
}
