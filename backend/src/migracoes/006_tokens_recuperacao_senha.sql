-- Sprint 6. Links de "Esqueci minha senha".
-- O banco guarda so o hash SHA-256 do token: o token em si vai apenas no
-- e-mail, entao quem ler o banco nao consegue montar um link valido.
-- Cada conta tem no maximo um link por vez (o pedido novo apaga o antigo).
CREATE TABLE tokens_recuperacao_senha (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash  CHAR(64)    NOT NULL UNIQUE,
  expira_em   TIMESTAMPTZ NOT NULL,
  usado_em    TIMESTAMPTZ,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX tokens_recuperacao_senha_usuario ON tokens_recuperacao_senha (usuario_id);
