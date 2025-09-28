# Backend - API EventPlus (instru��es para o backend)

Este README descreve de forma objetiva como clonar, configurar e executar apenas o backend desta API localmente.

## Pr�-requisitos
- .NET 8 SDK
- SQL Server local (LocalDB, SQLEXPRESS) ou acesso a uma inst�ncia remota
- (Opcional) Visual Studio 2022 ou terminal (PowerShell / bash)

## 1) Clonar o reposit�rio
No terminal:

```sh
git clone https://github.com/GuilhermeOliveira23/eventplus_deploy
cd Event+_Api_tarde/webapi.event+.tarde
```

## 2) Configurar connection string (modo simples)
1. Abra `appsettings.json` e atualize `ConnectionStrings:EventPlus` com a sua connection string local.
2. Exemplo para SQLEXPRESS:

```json
{
  "ConnectionStrings": {
    "EventPlus": "Server=DESKTOP-EXEMPLO\\SQLEXPRESS;Database=eventplus_tarde;User Id=sa;Password=SuaSenhaAqui;TrustServerCertificate=True;Connect Timeout=60;"
  }
}
```
3. Observa��o: a aplica��o l� `builder.Configuration.GetConnectionString("EventPlus")`. Vari�veis de ambiente (`ConnectionStrings__EventPlus`) ou user-secrets podem sobrescrever esse valor.

## 3) (Opcional) Alternativas seguras
- User-secrets:
```sh
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:EventPlus" "<sua-connection-string>"
```
- Vari�vel de ambiente (sess�o PowerShell):
```powershell
$env:ConnectionStrings__EventPlus = "<sua-connection-string>"
```

## 4) Aplicar migrations (se houver)
Se o projeto possui migrations:

```sh
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet ef database update
```

Execute no diret�rio do projeto (onde est� o .csproj).

Para criar uma migration nova:

```
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Execute os comandos no diret�rio que cont�m o `.csproj` com o `EventContext`.


## 5) Rodar a API
- Via CLI:

```sh
dotnet restore
dotnet build
dotnet run --launch-profile "https"
```
- Via Visual Studio: abra solu��o e execute com perfil https ou IIS Express.

Abra o Swagger: https://localhost:7209/swagger (ajuste a porta conforme sa�da do `dotnet run`).

## 6) Testar endpoints
- Para obter token JWT: POST `/api/Login` com body JSON `{ "email": "...", "senha": "..." }`.
- Em chamadas protegidas, envie header `Authorization: Bearer <token>`.

## 7) Problemas comuns
- Se a aplica��o usar uma connection string diferente, verifique vari�veis de ambiente e reinicie o VS/terminal.
- Erro 40 (Named Pipes): habilite TCP/IP em SQL Server Configuration Manager ou force `Server=tcp:<host>,1433`.
- Timeout no Azure: banco serverless pode pausar; aumente `Connect Timeout`, habilite retry no EF ou verifique portas outbound.

## 8) Seguran�a
- Nunca comite `appsettings.json` com senha. Prefira `appsettings.json.template`, `dotnet user-secrets` ou vari�veis de ambiente.

## Arquivo de exemplo para commitar
`appsettings.json.template` (sem segredos):

```json
{
  "ConnectionStrings": {
    "EventPlus": "Server=SEU_SERVER;Database=SEU_DB;User Id=SEU_USER;Password=<<SUA_SENHA_AQUI>>;TrustServerCertificate=True;Connect Timeout=60;"
  },
  "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } },
  "AllowedHosts": "*"
}
