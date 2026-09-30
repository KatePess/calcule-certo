-- Dados da empresa de quem usa o sistema, preenchidos em "Meu perfil".
-- Uma empresa por conta (usuario_id e a chave). O CNPJ continua em
-- usuarios.cnpj, como no diagrama de classes do TCC; esta tabela guarda o
-- resto. Todos os campos sao opcionais: a pessoa preenche aos poucos.
CREATE TABLE empresas (
  usuario_id          INTEGER      PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  razao_social        VARCHAR(150),
  nome_fantasia       VARCHAR(150),
  inscricao_estadual  VARCHAR(20),
  email_corporativo   VARCHAR(150),
  telefone            VARCHAR(11),
  funcionarios        INTEGER      CHECK (funcionarios >= 0),
  porte               VARCHAR(10)  CHECK (porte IN ('MEI','ME','EPP','MEDIO','GRANDE')),
  ramo_atividade      VARCHAR(120),
  cidade              VARCHAR(100),
  uf                  CHAR(2),
  atualizado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
