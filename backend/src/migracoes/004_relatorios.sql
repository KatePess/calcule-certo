-- Sprint 3. Classe RelatorioPDF do diagrama. O PDF em si e gerado na hora do
-- download (Sprint 4), por isso nao ha coluna com o caminho do arquivo.
CREATE TABLE relatorios (
  id          SERIAL PRIMARY KEY,
  -- Excluir o calculo exclui o relatorio junto.
  calculo_id  INTEGER     NOT NULL UNIQUE REFERENCES calculos(id) ON DELETE CASCADE,
  gerado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  baixado_em  TIMESTAMPTZ
);
