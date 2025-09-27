# EventPlus

EventPlus é uma plataforma para gerenciamento de eventos que permite criar, editar, buscar e gerenciar inscrições em eventos. Projeto desenvolvido como portfólio para candidatura a vagas de estágio em desenvolvimento full‑stack.

## Tecnologias
- Frontend: React.js  
- Backend: ASP.NET Core (C#)  
- ORM: Entity Framework Core  
- Banco de dados: SQL Server  
- Deploy: Vercel (frontend) / Azure App Service (backend) — ajustar conforme atualização  
- Autenticação: JWT  
- Controle de versão: Git / GitHub

## Principais funcionalidades
- Cadastro, edição e remoção de eventos (CRUD)  
- Autenticação de usuários com JWT (login / registro)  
- Upload de imagens para eventos  
- Busca e filtro de eventos por data e local  
- Integração frontend ↔ backend via API REST


## Como rodar localmente

### Pré-requisitos
- .NET SDK compatível com o projeto  
- Node.js (v16+ recomendado)  
- SQL Server (ou ajuste a string de conexão)  
- Git

### 1) Clone o repositório
```bash
git clone https://github.com/GuilhermeOliveira23/eventplus_deploy.git
cd eventplus_deploy
```

### 2) Backend (API)
- Entre na pasta do backend (ex.: `./backend` ou `./Api`)  
- Restaure os pacotes:
```bash
dotnet restore
```
- Atualize a string de conexão em `appsettings.json` (ex.: `ConnectionStrings:DefaultConnection`)  
- Aplique migrações (se houver):
```bash
dotnet ef database update
```
- Execute a API:
```bash
dotnet run
```
A API normalmente ficará disponível em `http://localhost:5000` ou `https://localhost:5001`.

### 3) Frontend (React)
- Entre na pasta do frontend (ex.: `./frontend` ou `./ClientApp`)  
- Instale dependências:
```bash
npm install
```
- Inicie a aplicação:
```bash
npm start
```
O frontend normalmente ficará disponível em `http://localhost:3000`.

## Variáveis de ambiente (exemplos)
- BACKEND_URL=http://localhost:5000  
- DATABASE__CONNECTIONSTRING=Server=.;Database=EventPlusDb;Trusted_Connection=True;  
- JWT__KEY=uma_chave_secreta_aqui


## Endpoints principais (exemplos)
- POST /api/auth/login — autenticação  
- POST /api/auth/register — registro de usuário  
- GET /api/events — listar eventos  
- GET /api/events/{id} — obter detalhes de um evento  
- POST /api/events — criar evento (autenticado)  
- PUT /api/events/{id} — atualizar evento (autenticado)  
- DELETE /api/events/{id} — remover evento (autenticado)

## Contato
Guilherme Gozzi Oliveira — olivergozzi@gmail.com — Tel: +55 11 94249-0823
