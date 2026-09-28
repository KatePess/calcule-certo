// Entrega ao navegador um arquivo recebido da API, abrindo o "salvar como"
// ou baixando direto, conforme a configuracao do navegador.
export function salvarArquivo(arquivo, nome) {
  const endereco = URL.createObjectURL(arquivo);
  const link = document.createElement('a');
  link.href = endereco;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Da tempo ao navegador de iniciar o download antes de liberar a memoria.
  setTimeout(() => URL.revokeObjectURL(endereco), 1000);
}
