-- Sprint 2. A licitacao nao existe no diagrama de classes original do TCC;
-- ela vem dos prototipos (Figuras C1 e C3, Painel e Resumo do sistema).
CREATE TABLE licitacoes (
  id             SERIAL PRIMARY KEY,
  usuario_id     INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  numero         VARCHAR(30)  NOT NULL,
  orgao          VARCHAR(120) NOT NULL,
  objeto         VARCHAR(255),
  status         VARCHAR(30)  NOT NULL DEFAULT 'EDITAL_ABERTO'
                 CHECK (status IN ('EDITAL_ABERTO','EM_ANDAMENTO','AGUARDANDO_APROVACAO','APROVADO','REPROVADO')),
  data_abertura  DATE,
  criado_em      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  atualizado_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),  -- o repositorio atualiza a cada UPDATE
  UNIQUE (usuario_id, orgao, numero)
);
