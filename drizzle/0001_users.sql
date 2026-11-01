CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  job_title TEXT NOT NULL,
  portfolio TEXT NOT NULL,
  chain TEXT NOT NULL,
  product TEXT NOT NULL,
  bo_owner TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
INSERT OR IGNORE INTO users VALUES ('demo-manager','Marina Costa','gestao@acervo.demo','gestao','Gestora do acervo','Todos','Todas','Todos','Marina Costa',1);
INSERT OR IGNORE INTO users VALUES ('demo-analyst','Rafael Almeida','analista@acervo.demo','analista','UX Researcher','Listado','Negociação','Home broker','Marina Costa',1);
INSERT OR IGNORE INTO settings VALUES ('taxonomy','{"portfolios":[{"name":"Listado","chains":[{"name":"Negociação","products":["Home broker","Plataforma de negociação"]},{"name":"Pós-negociação","products":["Liquidação","Custódia"]}]},{"name":"Balcão","chains":[{"name":"Registro de ativos","products":["Renda fixa","Derivativos"]},{"name":"Serviços de dados","products":["Portal de dados"]}]},{"name":"Infraestrutura","chains":[{"name":"Experiência do cliente","products":["Portal do cliente","Atendimento"]},{"name":"Serviços corporativos","products":["Design System"]}]}]}');
