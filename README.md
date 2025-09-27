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

## Demonstração
- Link de produção: https://eventplus-deploy.vercel.app  
- API em produção: https://eventplusapi-h9dmetekh6ehbqdc.brazilsouth-01.azurewebsites.net  

### Credenciais de teste:
- Administrador → admin@gmail.com / 123456  
- Usuário comum → comum@gmail.com / 123456

- Screenshots: adicione imagens na pasta `/docs/screenshots` e referencie aqui.

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
- Entre na pasta do backend:
```bash
cd "Event+_Api_tarde/webapi.event+.tarde"
```
- Restaure os pacotes:
```bash
dotnet restore
```
- Atualize a string de conexão em `appsettings.json` (conexão `EventPlus`)  
- Aplique migrações (se houver):
```bash
dotnet ef database update
```
- Execute a API:
```bash
dotnet run
```
A API ficará disponível em `https://localhost:7209` (conforme configurado no projeto).

### 3) Frontend (React)
- Na raiz do projeto, instale as dependências:
```bash
npm install
```
- Inicie a aplicação:
```bash
npm start
```
O frontend ficará disponível em `http://localhost:3000`.

## Variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e configure as variáveis conforme necessário:

- REACT_APP_API_URL=https://localhost:7209/api  

Para o backend, configure no `appsettings.json`:
- ConnectionStrings__EventPlus=Server=.;Database=EventPlusDb;Trusted_Connection=True;  
- Chave JWT configurada no Program.cs

## Endpoints principais
- POST /api/Login — autenticação de usuário  
- GET /api/Evento/Listar — listar todos os eventos  
- POST /api/PresencaEvento/Cadastrar — inscrição em evento  
- GET /api/PresencaEvento/ListarMinhas — listar presenças do usuário  
- POST /api/ComentarioEvento — comentar em evento  
- GET /api/TipoEvento — listar tipos de evento  
- GET /api/Instituicao — listar instituições  

Documentação completa disponível em `/swagger` quando a API estiver rodando.

## Contribuindo
1. Abra uma issue descrevendo a proposta ou correção.  
2. Faça um fork, crie uma branch com a sua feature (`feature/nome-da-feature`) e abra um pull request.  
3. Mantenha commits pequenos e mensagens claras.

## Contato
Guilherme Gozzi Oliveira — olivergozzi@gmail.com — Tel: +55 11 94249-0823

## Licença
Este projeto está licenciado sob a licença MIT. Adicione um arquivo `LICENSE` se desejar.