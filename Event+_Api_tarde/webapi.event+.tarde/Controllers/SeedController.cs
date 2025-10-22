using Microsoft.AspNetCore.Mvc;
using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Scripts;

namespace webapi.event_.tarde.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly EventContext _context;

        public SeedController(EventContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Popula o banco de dados com dados de teste
        /// </summary>
        /// <returns>Mensagem de sucesso ou erro</returns>
        [HttpPost("populate")]
        public async Task<IActionResult> PopulateDatabase()
        {
            try
            {
                var seeder = new DatabaseSeeder(_context);
                await seeder.SeedAsync();
                
                return Ok(new
                {
                    message = "Banco de dados populado com sucesso!",
                    admin = new
                    {
                        email = "admin@gmail.com",
                        senha = "123456"
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = "Erro ao popular banco de dados",
                    error = ex.Message
                });
            }
        }
    }
}
