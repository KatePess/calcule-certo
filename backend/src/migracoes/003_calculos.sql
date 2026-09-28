-- Sprint 3. Guarda as entradas E o resultado de cada calculo: se a formula
-- mudar no futuro, os relatorios antigos continuam mostrando o que foi gerado
-- na epoca (ver versao_formula).
CREATE TABLE calculos (
  id                      SERIAL PRIMARY KEY,
  usuario_id              INTEGER       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  -- Sem ON DELETE CASCADE: licitacao com calculos nao pode ser excluida.
  licitacao_id            INTEGER       NOT NULL REFERENCES licitacoes(id),
  -- entradas
  orcamento_empresa       NUMERIC(14,2)          CHECK (orcamento_empresa >= 0),  -- opcional
  quantidade_itens        INTEGER       NOT NULL CHECK (quantidade_itens > 0),
  custo_fixo              NUMERIC(14,2) NOT NULL CHECK (custo_fixo >= 0),
  custo_variavel          NUMERIC(14,2) NOT NULL CHECK (custo_variavel >= 0),
  seguro                  NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (seguro >= 0),
  taxa_plataforma         NUMERIC(7,4)  NOT NULL CHECK (taxa_plataforma >= 0 AND taxa_plataforma < 100),
  comissao_terceiros      NUMERIC(7,4)  NOT NULL CHECK (comissao_terceiros >= 0 AND comissao_terceiros < 100),
  margem_lucro            NUMERIC(7,4)  NOT NULL CHECK (margem_lucro >= 0 AND margem_lucro < 100),
  -- Copia das taxas adicionais usadas: [{ "nome", "percentual", "valor" }].
  taxas_adicionais        JSONB         NOT NULL DEFAULT '[]',
  -- resultado
  custo_direto            NUMERIC(14,2) NOT NULL,
  custo_indireto          NUMERIC(14,2) NOT NULL,
  custo_total             NUMERIC(14,2) NOT NULL,
  valor_taxa_plataforma   NUMERIC(14,2) NOT NULL,
  valor_comissao          NUMERIC(14,2) NOT NULL,
  valor_taxas_adicionais  NUMERIC(14,2) NOT NULL,
  lucro_estimado          NUMERIC(14,2) NOT NULL,
  resultado_final         NUMERIC(14,2) NOT NULL,
  versao_formula          VARCHAR(10)   NOT NULL,
  criado_em               TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX calculos_usuario_data ON calculos (usuario_id, criado_em DESC);
CREATE INDEX calculos_licitacao ON calculos (licitacao_id);
