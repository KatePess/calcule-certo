// Erro que ja carrega o status HTTP correspondente, permitindo que a camada
// de servico sinalize a falha sem conhecer o Express.
export class ErroDeAplicacao extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ErroDeAplicacao';
    this.status = status;
  }
}
