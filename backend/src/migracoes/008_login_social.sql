-- Sprint 7: login com Google e LinkedIn. Quem entra por esses provedores nao
-- cria senha, entao o hash passa a ser opcional. A pessoa pode definir uma
-- senha depois pelo "Esqueci minha senha".
ALTER TABLE usuarios ALTER COLUMN senha_hash DROP NOT NULL;
