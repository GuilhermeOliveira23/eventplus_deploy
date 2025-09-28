using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;
using webapi.event_.tarde.Repositories;



namespace webapi.event_.tarde.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class PresencaEventoController : ControllerBase
    {
        private IPresencaEvento _presencaEventoRepository { get; set; }
        public PresencaEventoController(IPresencaEvento presencaEventoRepository)
        {

            _presencaEventoRepository = presencaEventoRepository;
        }

        [HttpPost("Cadastrar")]
        [Authorize(Roles = "Comum")]
        public IActionResult Post(PresencaEvento presencaEvento)
        {

            if (presencaEvento == null)
            {
                return BadRequest("O objeto chegou null!");
            }

            try
            {
                _presencaEventoRepository.Cadastrar(presencaEvento);
                return StatusCode(201);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Comum")]
        public IActionResult Delete(Guid id)
        {


            try
            {
                _presencaEventoRepository.Deletar(id);

                return NoContent();
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);

            }

        }

        [HttpGet]
        [Authorize(Roles = "Comum")]
        public IActionResult Get()
        {
            try
            {
                return Ok(_presencaEventoRepository.Listar());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpGet("ListarMinhas/{id}")]
        [Authorize(Roles = "Comum")]
        public IActionResult GetById(Guid id)
        {

            

            try
            {
               

                return Ok(_presencaEventoRepository.BuscarPorId(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Comum")]
        public IActionResult Put(Guid id, PresencaEvento presencaEvento)
        {
            try
            {
                _presencaEventoRepository.Atualizar(id, presencaEvento);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }

        }
    }
}
