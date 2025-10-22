using Bogus;
using Microsoft.EntityFrameworkCore;
using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Utils;

namespace webapi.event_.tarde.Scripts
{
    public class DatabaseSeeder
    {
        private readonly EventContext _context;

        public DatabaseSeeder(EventContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            Console.WriteLine("==================================================");
            Console.WriteLine("     INICIANDO POPULAÇÃO DO BANCO DE DADOS...");
            Console.WriteLine("==================================================");

            // --- Gerando Tipos de Usuário ---
            var tiposUsuario = new List<TipoUsuario>
            {
                new TipoUsuario { Titulo = "Administrador" },
                new TipoUsuario { Titulo = "Comum" }
            };
            _context.TipoUsuario.AddRange(tiposUsuario);
            await _context.SaveChangesAsync();
            Console.WriteLine("✅ Tipos de Usuário criados.");

            // --- Gerando Instituições ---
            var instituicaoFaker = new Faker<Instituicao>("pt_BR")
                .RuleFor(i => i.NomeFantasia, f => f.Company.CompanyName())
                .RuleFor(i => i.CNPJ, f => f.Random.Replace("##############")) // 14 dígitos
                .RuleFor(i => i.Endereco, f => f.Address.FullAddress());

            var instituicoes = instituicaoFaker.Generate(20);
            _context.Instituicao.AddRange(instituicoes);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ {instituicoes.Count} Instituições criadas.");

            // --- Gerando Tipos de Evento ---
            var tiposEvento = new List<TipoEvento>
            {
                new TipoEvento { Titulo = "Conferência de Tecnologia" },
                new TipoEvento { Titulo = "Workshop de Design" },
                new TipoEvento { Titulo = "Show Musical" },
                new TipoEvento { Titulo = "Feira de Negócios" },
                new TipoEvento { Titulo = "Hackathon" },
                new TipoEvento { Titulo = "Webinar Online" }
            };
            _context.TipoEvento.AddRange(tiposEvento);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ {tiposEvento.Count} Tipos de Evento criados.");

            // --- Gerando Usuário Admin Fixo ---
            Console.WriteLine("Criando usuário administrador padrão...");
            var adminTipoUsuario = tiposUsuario.FirstOrDefault(tu => tu.Titulo == "Administrador");
            if (adminTipoUsuario != null)
            {
                var adminUser = new Usuario
                {
                    Nome = "Admin Teste",
                    Email = "admin@gmail.com",
                    Senha = Criptografia.GerarHash("123456"),
                    IdTipoUsuario = adminTipoUsuario.IdTipoUsuario
                };
                _context.Usuario.Add(adminUser);
                await _context.SaveChangesAsync();
                Console.WriteLine("✅ Usuário Administrador criado! (admin@gmail.com / 123456)");
            }

            // --- Gerando Usuários ---
            var usuarioFaker = new Faker<Usuario>("pt_BR")
                .RuleFor(u => u.Nome, f => f.Name.FullName())
                .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.Nome))
                .RuleFor(u => u.Senha, f => Criptografia.GerarHash("123456"))
                .RuleFor(u => u.IdTipoUsuario, f => f.PickRandom(tiposUsuario).IdTipoUsuario);

            var usuarios = usuarioFaker.Generate(200);
            _context.Usuario.AddRange(usuarios);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ {usuarios.Count} Usuários aleatórios criados.");

            // Adicionar o admin à lista de usuários para usar nas presenças
            var adminFromDb = await _context.Usuario.FirstOrDefaultAsync(u => u.Email == "admin@gmail.com");
            if (adminFromDb != null)
            {
                usuarios.Add(adminFromDb);
            }

            // --- Gerando Eventos ---
            var frasesIniciais = new[] { "Participe e aprenda", "Junte-se a nós para imersão em", "Descubra as últimas tendências sobre", "Conecte-se com especialistas de" };
            var frasesFinais = new[] { "Inscrições abertas, vagas limitadas!", "Garanta já o seu lugar.", "Uma oportunidade única." };

            var eventoFaker = new Faker<Evento>("pt_BR")
                .RuleFor(e => e.Nome, f => f.Commerce.ProductName() + " Summit")
                .RuleFor(e => e.Descricao, (f, e) =>
                    $"{f.PickRandom(frasesIniciais)} {e.Nome.Replace(" Summit", "")}. " +
                    $"{f.Rant.Review()}. {f.Lorem.Sentence(10)}. {f.PickRandom(frasesFinais)}")
                .RuleFor(e => e.DataEvento, f => f.Date.Future(1, DateTime.Now.AddMonths(1)))
                .FinishWith((f, e) =>
                {
                    e.IdInstituicao = f.PickRandom(instituicoes).IdInstituicao;
                    e.IdTipoEvento = f.PickRandom(tiposEvento).IdTipoEvento;
                });

            var eventos = eventoFaker.Generate(100);
            _context.Evento.AddRange(eventos);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ {eventos.Count} Eventos criados.");

            // --- Gerando Presenças em Eventos (em lotes) ---
            var presencaFaker = new Faker<PresencaEvento>("pt_BR")
                .RuleFor(p => p.Situacao, f => f.Random.Bool())
                .FinishWith((f, p) =>
                {
                    p.IdUsuario = f.PickRandom(usuarios).IdUsuario;
                    p.IdEvento = f.PickRandom(eventos).IdEvento;
                });

            var presencas = presencaFaker.Generate(500)
                .GroupBy(p => new { p.IdUsuario, p.IdEvento })
                .Select(g => g.First())
                .ToList();

            Console.WriteLine("Iniciando inserção de presenças em lotes...");
            int batchSize = 50;
            int presencasCriadas = 0;
            for (int i = 0; i < presencas.Count; i += batchSize)
            {
                var batch = presencas.Skip(i).Take(batchSize).ToList();
                _context.PresencaEvento.AddRange(batch);
                await _context.SaveChangesAsync();
                presencasCriadas += batch.Count;
                Console.WriteLine($"  - Lote processado. {presencasCriadas}/{presencas.Count} presenças salvas.");
            }

            // --- Gerando Comentários em Eventos ---
            var comentarioFaker = new Faker<ComentarioEvento>("pt_BR")
                .RuleFor(c => c.Descricao, f => f.Rant.Review())
                .RuleFor(c => c.Exibe, f => f.Random.Bool(0.8f)) // 80% dos comentários visíveis
                .FinishWith((f, c) =>
                {
                    c.IdUsuario = f.PickRandom(usuarios).IdUsuario;
                    c.IdEvento = f.PickRandom(eventos).IdEvento;
                });

            var comentarios = comentarioFaker.Generate(300);
            _context.ComentarioEvento.AddRange(comentarios);
            await _context.SaveChangesAsync();
            Console.WriteLine($"✅ {comentarios.Count} Comentários criados.");

            Console.WriteLine("\n==================================================");
            Console.WriteLine("     ✅ Banco de dados populado com sucesso!");
            Console.WriteLine("==================================================");
            Console.WriteLine($"\n📊 RESUMO:");
            Console.WriteLine($"   - Tipos de Usuário: {tiposUsuario.Count}");
            Console.WriteLine($"   - Instituições: {instituicoes.Count}");
            Console.WriteLine($"   - Tipos de Evento: {tiposEvento.Count}");
            Console.WriteLine($"   - Usuários: {usuarios.Count}");
            Console.WriteLine($"   - Eventos: {eventos.Count}");
            Console.WriteLine($"   - Presenças: {presencasCriadas}");
            Console.WriteLine($"   - Comentários: {comentarios.Count}");
            Console.WriteLine($"\n🔑 Login Administrador:");
            Console.WriteLine($"   Email: admin@gmail.com");
            Console.WriteLine($"   Senha: 123456");
        }
    }
}
