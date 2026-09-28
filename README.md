# Calcule Certo

Sistema web para automatizar o cálculo de custos operacionais e margens de lucro
de empresas privadas que participam de processos de licitação pública.

Trabalho de Conclusão de Curso — Sistemas de Informação, UniNORTE
Autora: Kate Pessoa dos Santos · Orientador: Prof. Juan Carlos Justiniano

## O que o sistema já faz

| Sprint | Entrega |
|---|---|
| 1 | Login e cadastro, senha com hash **bcrypt**, sessão por **JWT** com "Lembrar minha senha" |
| 2 | Menu lateral, cadastro de licitações (criar, editar, mudar status, excluir) com busca e paginação |
| 3 | Tela de novo cálculo (Figura C1), motor de cálculo com precisão de centavos e resumo (Figura C2) |
| 4 | Central de relatórios (Figura C3): filtros, PDF de uma página, editar e excluir — **fecha o MVP** |
| 5 | Painel inicial com alertas de prazo, taxas salvas para reutilizar e tela de perfil (dados e senha) |
| 6 | "Esqueci minha senha" com link por e-mail, dependências sem alertas de segurança e roteiro de homologação |

Tudo com layout responsivo para desktop e celular (requisito não funcional do TCC).

> **Atenção:** a fórmula do cálculo segue a proposta da seção 5 do
> [plano de implementação](docs/PLANO-DE-IMPLEMENTACAO.md) e ainda precisa ser
> validada com a empresa parceira (perguntas Q1 a Q5).

## Tecnologias

Conforme a seção 2.5 do TCC:

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite + React Router + MobX |
| Back-end | Node.js + Express |
| Banco de dados | PostgreSQL 16 (via Docker) |
| Segurança | bcryptjs (hash de senha) + jsonwebtoken (sessão) |
| Cálculo | decimal.js (contas em centavos exatos, sem erro de ponto flutuante) |
| PDF | pdfmake (gerado no servidor) |
| E-mail | nodemailer (link de recuperação de senha) |

## Arquitetura

O código está separado em camadas, cada uma com uma responsabilidade única.
Uma mudança de regra, de texto ou de banco atinge um arquivo só.

**Back-end** — requisição → rota → controlador → serviço → repositório → banco:

| Camada | Responsabilidade |
|---|---|
| `rotas/` | Mapeia caminhos para métodos do controlador |
| `controladores/` | Traduz HTTP em chamada de serviço e vice-versa |
| `servicos/` | Regras de negócio e validações |
| `repositorios/` | Único lugar que conhece SQL |
| `middleware/` | Autenticação por token, validação de id e tratamento central de erros |
| `constantes/` | Mensagens, códigos HTTP, regras de validação, caminhos |
| `utils/` | Hash de senha, token, dinheiro, datas, formatação, validadores |
| `config/` | Leitura centralizada do `.env` |
| `migracoes/` | Arquivos SQL numerados que criam e alteram as tabelas |

O motor de cálculo (`servicos/motorCalculo.js`) é uma função pura: recebe os
números e devolve o resultado, sem tocar no banco. Isso permite testá-lo
isoladamente e o servidor sempre recalcula antes de salvar.

**Front-end** — componente → store → serviço → API:

| Camada | Responsabilidade |
|---|---|
| `paginas/` | Telas (Login, Cadastro, Painel, Resumo, Novo cálculo, Relatórios, Perfil) |
| `componentes/` | Layout (menu e cabeçalho), campos de moeda e percentual, modal, ícones |
| `stores/` | Estado da aplicação com **MobX** |
| `servicos/` | Chamadas à API |
| `constantes/` | Rotas, endpoints, textos, regras de validação |
| `utils/` | Formatadores, validadores, acesso ao armazenamento |
| `estilos/` | CSS de cada tela |

### Sobre o MobX

Cada assunto tem sua store em `stores/`: sessão, licitações, cálculo,
relatórios, painel e taxas salvas. Todas ficam reunidas em `stores/index.jsx`.
Componentes marcados com `observer()` são redesenhados sozinhos quando a store
muda — não é preciso repassar dados de tela em tela. Ao sair da conta, todas as
stores são limpas.

## Estrutura de pastas

```
calcule-certo/
├── docker-compose.yml
├── backend/
│   ├── .env                  # configuração local (não vai para o Git)
│   ├── src/
│   │   ├── app.js            # monta o Express e registra as rotas
│   │   ├── server.js         # só coloca a API no ar
│   │   ├── db.js
│   │   ├── config/
│   │   ├── constantes/
│   │   ├── controladores/
│   │   ├── middleware/
│   │   ├── repositorios/
│   │   ├── rotas/
│   │   ├── servicos/
│   │   ├── utils/
│   │   ├── migracoes/        # SQL numerado (001, 002, ...)
│   │   └── scripts/          # migrar e db:setup
│   └── testes/               # testes do motor e da API
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── componentes/
│       ├── constantes/
│       ├── estilos/
│       ├── paginas/
│       ├── servicos/
│       ├── stores/
│       └── utils/
└── docs/
    ├── PLANO-DE-IMPLEMENTACAO.md
    ├── HOMOLOGACAO.md        # roteiro da sessão com a empresa parceira
    └── prototipo/            # telas do Figma usadas como referência
```

## Como rodar

Pré-requisitos: **Node.js 20+** e **Docker Desktop** instalados.

### 1. Subir o banco de dados

```bash
docker compose up -d
```

### 2. Preparar o back-end

```bash
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

O `db:setup` aplica as migrações do banco e cria os dados de demonstração.
Pode rodar quantas vezes quiser: ele nunca duplica nada.

A API sobe em http://localhost:3001

### 3. Subir o front-end

Em **outro terminal**:

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em http://localhost:5173

### Depois de baixar uma versão nova do código

Se a atualização trouxe tabelas novas, aplique as migrações pendentes:

```bash
cd backend
npm run migrar
```

### Recuperação de senha em desenvolvimento

Sem servidor de e-mail configurado, o e-mail não é enviado: o conteúdo,
com o link, aparece **no terminal da API**. Para testar, clique em
"Esqueci minha senha" no login e abra o link impresso no terminal.

### Usuário de demonstração

| E-mail | Senha |
|---|---|
| kate@calculecerto.com | calcule123 |

## Testes

```bash
cd backend
npm test
```

Os testes usam um banco **separado** (`calcule_certo_teste`), criado
automaticamente. Eles se recusam a rodar em qualquer banco cujo nome não
termine em `_teste`, para nunca apagar os dados de desenvolvimento.

## Colocar em produção

No `.env` do servidor:

| Variável | O que colocar |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SEGREDO` | Valor aleatório com 32 caracteres ou mais. **A API não sobe** com o valor do `.env.example` |
| `URL_FRONT` | Endereço público do front-end (vai no link do e-mail) |
| `SMTP_HOST`, `SMTP_PORTA`, `SMTP_USUARIO`, `SMTP_SENHA` | Dados do servidor de e-mail |

Para gerar o segredo:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| Login responde **erro 500** e o log da API mostra `ECONNREFUSED 127.0.0.1:5432` | O Docker Desktop está fechado, então o banco não subiu | Abra o Docker Desktop e rode `docker compose up -d` |
| `npm run dev` falha com `EADDRINUSE: address already in use :::3001` | Um servidor antigo continua rodando em segundo plano | Encerre o processo (comando abaixo) e rode de novo |
| O terminal "trava" depois de `npm run dev` | Não travou: o servidor fica ocupando aquele terminal | Deixe-o aberto e use outro terminal; para parar, `Ctrl+C` |
| A API encerra com `Erro de configuração: JWT_SEGREDO...` | Falta o `.env` ou o segredo é fraco em produção | Copie o `.env.example` para `.env` ou gere um segredo (seção anterior) |

Para liberar a porta 3001 no Windows (PowerShell):

```powershell
Get-NetTCPConnection -State Listen -LocalPort 3001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/cadastrar` | Cria uma conta e já devolve o token |
| POST | `/api/auth/login` | Autentica e devolve o token |
| GET | `/api/auth/eu` | Dados do usuário logado (exige token) |
| PUT | `/api/auth/perfil` | Atualiza nome e CNPJ |
| PUT | `/api/auth/senha` | Troca a senha (exige a senha atual) |
| POST | `/api/auth/esqueci-senha` | Envia o link de recuperação (resposta igual exista ou não a conta) |
| POST | `/api/auth/redefinir-senha` | Define a nova senha com o link (uso único, 30 minutos) |
| GET | `/api/licitacoes` | Lista paginada, com filtro por status e busca |
| POST | `/api/licitacoes` | Cadastra licitação |
| GET, PUT, DELETE | `/api/licitacoes/:id` | Consulta, edita e exclui |
| PATCH | `/api/licitacoes/:id/status` | Muda o status |
| POST | `/api/calculos/simular` | Calcula sem salvar (modal de resumo) |
| POST | `/api/calculos` | Recalcula no servidor e salva cálculo + relatório |
| GET | `/api/calculos/:id` | Entradas e resultado de um cálculo salvo |
| GET | `/api/relatorios` | Lista com filtro por período e licitação |
| GET | `/api/relatorios/:id/pdf` | Gera e baixa o PDF |
| DELETE | `/api/relatorios/:id` | Exclui relatório e cálculo |
| GET, POST | `/api/taxas` | Lista e cadastra taxas salvas |
| PUT, DELETE | `/api/taxas/:id` | Edita e exclui uma taxa salva |
| GET | `/api/painel` | Licitações e relatórios recentes e alertas de prazo |
| GET | `/api/saude` | Verificação de que a API está no ar |

## Próximos passos

- Homologação com a empresa parceira: validar a fórmula e comparar com a
  planilha — roteiro em [docs/HOMOLOGACAO.md](docs/HOMOLOGACAO.md)
- Fora do escopo do TCC: login social (Google / LinkedIn) e busca geral
