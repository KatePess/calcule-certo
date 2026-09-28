import { consultar } from '../db.js';

const COLUNAS = `
  c.id, c.licitacao_id, c.orcamento_empresa, c.quantidade_itens, c.custo_fixo,
  c.custo_variavel, c.seguro, c.taxa_plataforma, c.comissao_terceiros,
  c.margem_lucro, c.taxas_adicionais, c.custo_direto, c.custo_indireto,
  c.custo_total, c.valor_taxa_plataforma, c.valor_comissao,
  c.valor_taxas_adicionais, c.lucro_estimado, c.resultado_final,
  c.versao_formula, c.criado_em,
  l.numero AS licitacao_numero, l.orgao AS licitacao_orgao, l.objeto AS licitacao_objeto
`;

export const calculoRepositorio = {
  // "cliente" permite gravar dentro da mesma transacao do relatorio.
  async inserir({ usuarioId, licitacaoId, entrada, resultado }, cliente) {
    const { rows } = await consultar(
      `INSERT INTO calculos (
         usuario_id, licitacao_id, orcamento_empresa, quantidade_itens, custo_fixo,
         custo_variavel, seguro, taxa_plataforma, comissao_terceiros, margem_lucro,
         taxas_adicionais, custo_direto, custo_indireto, custo_total,
         valor_taxa_plataforma, valor_comissao, valor_taxas_adicionais,
         lucro_estimado, resultado_final, versao_formula
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING id`,
      [
        usuarioId,
        licitacaoId,
        entrada.orcamentoEmpresa?.toString() ?? null,
        entrada.quantidadeItens,
        entrada.custoFixo.toString(),
        entrada.custoVariavel.toString(),
        entrada.seguro.toString(),
        entrada.taxaPlataforma.toString(),
        entrada.comissaoTerceiros.toString(),
        entrada.margemLucro.toString(),
        JSON.stringify(resultado.taxasAdicionais),
        resultado.custoDireto,
        resultado.custoIndireto,
        resultado.custoTotal,
        resultado.valorTaxaPlataforma,
        resultado.valorComissao,
        resultado.valorTaxasAdicionais,
        resultado.lucroEstimado,
        resultado.resultadoFinal,
        resultado.versaoFormula,
      ],
      cliente,
    );
    return rows[0].id;
  },

  async buscarPorId(id, usuarioId) {
    const { rows } = await consultar(
      `SELECT ${COLUNAS}
         FROM calculos c
         JOIN licitacoes l ON l.id = c.licitacao_id
        WHERE c.id = $1 AND c.usuario_id = $2`,
      [id, usuarioId],
    );
    return rows[0] ?? null;
  },

  async excluir(id, usuarioId) {
    const { rowCount } = await consultar('DELETE FROM calculos WHERE id = $1 AND usuario_id = $2', [id, usuarioId]);
    return rowCount > 0;
  },
};
