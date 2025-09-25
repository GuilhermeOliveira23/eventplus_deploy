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
    public class TipoEventoController : ControllerBase
    {
        private ITipoEventoRepository _tipoEventoRepository { get; set; }
        public TipoEventoController(ITipoEventoRepository tipoEventoRepository)
        {

            _tipoEventoRepository = tipoEventoRepository;
        }

        [HttpPost]
        public IActionResult Post(TipoEvento tipoEvento)
        {

            try
            {
                _tipoEventoRepository.Cadastrar(tipoEvento);
                return StatusCode(201);
            }
            catch (Exception e )
            {
                return BadRequest(e.Message);
                throw;
            }

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {

       
            try
            {
                _tipoEventoRepository.Deletar(id);

                return NoContent();
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);

            }

        }

        [HttpGet("Listar")]
        public IActionResult Get()
        {
            try
            {
                return Ok(_tipoEventoRepository.Listar());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            try
            {


                return Ok(_tipoEventoRepository.BuscarPorId(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpPut("{id}")]
        public IActionResult Put(Guid id, TipoEvento estudio)
        {
            try
            {
                _tipoEventoRepository.Atualizar(id, estudio);
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

