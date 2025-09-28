# EventPlus

EventPlus é uma plataforma para gerenciamento de eventos que permite criar, editar, buscar e gerenciar inscrições em eventos. Projeto desenvolvido como portfólio para candidatura a vagas de estágio em desenvolvimento full‑stack.

Link do site já pronto: https://eventplus-deploy.vercel.app/

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
- Conectar e Desconectar de Eventos  
- Busca de eventos por tipo de evento e por meus eventos  
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


## 2) Opção C — editar localmente (mais simples)
Abra `appsettings.json` e altere apenas a connection string `ConnectionStrings:EventPlus` para apontar para o seu SQL local.
Exemplo:

{ "ConnectionStrings": { "EventPlus": "Server={DESKTOP-KZ1TNT2\SQLEXPRESS};Database=eventplus_tarde;User Id=sa;Password=SuaSenhaAqui;TrustServerCertificate=True;Connect Timeout=30;" } }
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
Essa aplicação já vem com swagger na Program.cs, então recomendo usar `http://localhost:5000/swagger` no seu navegador ao invés de Insomnia ou outros.

### 3) Frontend (React)
- Entre na pasta do frontend `eventplus_deploy` 
- Instale dependências:
```bash
npm install
```

## 4) Configuração da API Local
- **Abra o arquivo `.env`** na raiz do projeto
- **Altere a porta** para a porta da sua API local:
```env
REACT_APP_LOCAL_API_URL=https://localhost:SUAPORTA/api
```
- **Exemplo**: Se sua API roda na porta 5000, use:
```env
REACT_APP_LOCAL_API_URL=https://localhost:5000/api
```

- Inicie a aplicação:
```bash
npm start
```
O frontend normalmente ficará disponível em `http://localhost:3000`.

Para a aplicação rodar normalmente, a api e o front end devem estar ligados.

## Contato
Guilherme Gozzi Oliveira — olivergozzi@gmail.com — Tel: +55 11 94249-0823
