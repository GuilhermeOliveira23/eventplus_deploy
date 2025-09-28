using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Interfaces;
using webapi.event_.tarde.Repositories;
using System.Text.RegularExpressions;
// não remova, é para testes


var builder = WebApplication.CreateBuilder(args);

//DEBUG: mostrar qual connection string foi resolvida
//string ResolveAndMask(string? cs)
//{
//    if (string.IsNullOrEmpty(cs)) return "<null or empty>";
//    // mascara password=... e pwd=...
//    var masked = Regex.Replace(cs, "(?i)(password|pwd)\\s*=\\s*([^;]+)", "$1=****", RegexOptions.Compiled);
//    return masked;
//}

//var resolvedCs = builder.Configuration.GetConnectionString("EventPlus");
//Console.WriteLine($"[DEBUG] ConnectionString(EventPlus) = {ResolveAndMask(resolvedCs)}");


// ======= Serviços =======
builder.Services.AddControllers();

// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultChallengeScheme = "JwtBearer";
    options.DefaultAuthenticateScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes("projeto-event-webapi-chave-autenticacao-ef")),
        ClockSkew = TimeSpan.FromMinutes(5),
        ValidIssuer = "webapi.event+.tarde",
        ValidAudience = "webapi.event+.tarde"
    };
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITipoUsuarioRepository, TipoUsuarioRepository>();
builder.Services.AddScoped<IInstituicaoRepository, InstituicaoRepository>();
builder.Services.AddScoped<IPresencaEvento, PresencaEventoRepository>();
builder.Services.AddScoped<IComentarioEvento, ComentarioEventoRepository>();
builder.Services.AddScoped<ITipoEventoRepository, TipoEventoRepository>();
// e assim por diante para os outros repositories

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000", // desenvolvimento
                "https://eventplusapi-h9dmetekh6ehbqdc.brazilsouth-01.azurewebsites.net", // produção
                "https://eventplus-deploy.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});


// Connection string do Azure SQL (ou do appsettings)
var connectionString = builder.Configuration.GetConnectionString("EventPlus");

builder.Services.AddDbContext<EventContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(60); // 60 segundos
         
    })
);
var app = builder.Build();

// ======= Middleware =======
app.UseHttpsRedirection();

// Swagger em qualquer ambiente
// Antes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API V1");
        c.RoutePrefix = "swagger";
    });
}

// Depois (para todos os ambientes)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API V1");
    c.RoutePrefix = "swagger";
});

// CORS
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
