-- Tabela criada na Sprint 1. O IF NOT EXISTS permite aplicar esta migracao
-- num banco que ja tinha a tabela, criada pela versao antiga do setup-db.
CREATE TABLE IF NOT EXISTS usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(120)  NOT NULL,
  email       VARCHAR(160)  NOT NULL UNIQUE,
  senha_hash  VARCHAR(255)  NOT NULL,
  cnpj        VARCHAR(18),
  criado_em   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
