# Calcule Certo

Sistema web para automatizar o cálculo de custos operacionais e margens de lucro
de empresas privadas que participam de processos de licitação pública.

Trabalho de Conclusão de Curso — Sistemas de Informação, UniNORTE
Autora: Kate Pessoa dos Santos · Orientador: Prof. Juan Carlos Justiniano

## Sprint 1 — Autenticação (entrega atual)

Esta primeira entrega implementa o módulo de acesso ao sistema, que corresponde
aos métodos `cadastrar()` e `autenticar()` da classe `Usuario` no diagrama de
classes (Apêndice A do TCC).

O que está funcionando:

- Tela de login fiel ao protótipo de alta fidelidade feito no Figma
- Tela de cadastro de novo usuário, com máscara de CNPJ
- Senhas gravadas com hash **bcrypt** (a senha em texto puro nunca é armazenada)
- Sessão mantida por **JWT**, com opção "Lembrar minha senha"
- Rota protegida: a Home só abre com um token válido
- Layout responsivo para desktop e celular (requisito não funcional do TCC)

## Tecnologias

Conforme a seção 2.5 do TCC:

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Vite + React Router + MobX |
| Back-end | Node.js + Express |
| Banco de dados | PostgreSQL 16 (via Docker) |
| Segurança | bcryptjs (hash de senha) + jsonwebtoken (sessão) |

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
| `middleware/` | Autenticação por token e tratamento central de erros |
| `constantes/` | Mensagens, códigos HTTP, regras de validação, caminhos |
| `utils/` | Hash de senha, token, formatação, validadores |
| `config/` | Leitura centralizada do `.env` |

**Front-end** — componente → store → serviço → API:

| Camada | Responsabilidade |
|---|---|
| `paginas/` | Telas (Login, Cadastro, Home) |
| `componentes/` | Guardas de rota e ícones |
| `stores/` | Estado da aplicação com **MobX** |
| `servicos/` | Chamadas à API |
| `constantes/` | Rotas, endpoints, textos, regras de validação |
| `utils/` | Formatadores, validadores, acesso ao armazenamento |
| `estilos/` | CSS de cada tela |

### Sobre o MobX

O estado da sessão vive em `stores/SessaoStore.js`. Componentes marcados com
`observer()` são redesenhados sozinhos quando a store muda — não é preciso
repassar dados de tela em tela. Novas stores (orçamento, relatórios) entram em
`stores/index.jsx` nas próximas sprints.

## Estrutura de pastas

```
calcule-certo/
├── docker-compose.yml
├── backend/
│   ├── .env                  # configuração local (não vai para o Git)
│   └── src/
│       ├── server.js
│       ├── db.js
│       ├── config/
│       ├── constantes/
│       ├── controladores/
│       ├── middleware/
│       ├── repositorios/
│       ├── rotas/
│       ├── servicos/
│       ├── utils/
│       └── scripts/
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
└── docs/prototipo/           # telas do Figma usadas como referência
```

## Como rodar

Pré-requisitos: **Node.js 18+** e **Docker Desktop** instalados.

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

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| Login responde **erro 500** e o log da API mostra `ECONNREFUSED 127.0.0.1:5432` | O Docker Desktop está fechado, então o banco não subiu | Abra o Docker Desktop e rode `docker compose up -d` |
| `npm run dev` falha com `EADDRINUSE: address already in use :::3001` | Um servidor antigo continua rodando em segundo plano | Encerre o processo (comando abaixo) e rode de novo |
| O terminal "trava" depois de `npm run dev` | Não travou: o servidor fica ocupando aquele terminal | Deixe-o aberto e use outro terminal; para parar, `Ctrl+C` |

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
| GET | `/api/saude` | Verificação de que a API está no ar |

## Próximas sprints

- Tela de entrada de parâmetros do cálculo (Figura C1 do TCC)
- Motor de cálculo de custos e margem de lucro
- Tela de resultado do cálculo (Figura C2 do TCC)
- Central de relatórios e exportação em PDF (Figura C3 do TCC)
- Recuperação de senha e login social (Google / LinkedIn)
