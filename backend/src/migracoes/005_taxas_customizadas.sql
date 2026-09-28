-- Sprint 5. Classe TaxaCustomizada do diagrama: taxas que o usuario salva
-- para reaproveitar em novos calculos (ex.: "Plataforma BLL", 1,5%).
-- tipo: PLATAFORMA preenche a taxa da plataforma; COMISSAO, a comissao de
-- terceiros; ADICIONAL entra como taxa adicional sobre o preco.
CREATE TABLE taxas_customizadas (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome        VARCHAR(80)  NOT NULL,
  percentual  NUMERIC(7,4) NOT NULL CHECK (percentual >= 0 AND percentual < 100),
  tipo        VARCHAR(20)  NOT NULL CHECK (tipo IN ('PLATAFORMA','COMISSAO','ADICIONAL')),
  criado_em   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, nome)
);
