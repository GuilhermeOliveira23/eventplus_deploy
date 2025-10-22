using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.RegularExpressions;
using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Interfaces;
using webapi.event_.tarde.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ⭐ NOVO: Configurar porta dinâmica para Railway
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

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
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Por favor, insira 'Bearer ' seguido do seu token JWT",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddScoped<IEventoRepository, EventoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITipoUsuarioRepository, TipoUsuarioRepository>();
builder.Services.AddScoped<IInstituicaoRepository, InstituicaoRepository>();
builder.Services.AddScoped<IPresencaEvento, PresencaEventoRepository>();
builder.Services.AddScoped<IComentarioEvento, ComentarioEventoRepository>();
builder.Services.AddScoped<ITipoEventoRepository, TipoEventoRepository>();

// CORS - ⭐ ADICIONE o domínio do Railway depois que for gerado
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "https://eventplus-deploy.vercel.app"
            // ⭐ Adicione aqui depois: "https://seu-app.up.railway.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

// ⭐ MODIFICADO: Connection string agora vem do Railway
var connectionString = builder.Configuration.GetConnectionString("EventPlus");

builder.Services.AddDbContext<EventContext>(options =>
    options.UseNpgsql(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(60);
    })
);

var app = builder.Build();

//  NOVO: Aplicar migrations automaticamente
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<EventContext>();
        db.Database.Migrate();
        Console.WriteLine(" Migrations aplicadas com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($" Erro ao aplicar migrations: {ex.Message}");
    }
}

// Swagger em todos os ambientes
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Minha API V1");
    c.RoutePrefix = "swagger";
});

// ======= Middleware =======
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();