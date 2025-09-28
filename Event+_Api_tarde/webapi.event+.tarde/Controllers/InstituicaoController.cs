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
    public class InstituicaoController : ControllerBase
    {
        private IInstituicaoRepository _instituicaoRepository { get; set; }
        public InstituicaoController(IInstituicaoRepository instituicaoRepository)
        {

            _instituicaoRepository = instituicaoRepository;
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public IActionResult Post(Instituicao instituicao)
        {

            try
            {
                _instituicaoRepository.Cadastrar(instituicao);
                return StatusCode(201);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }

        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public IActionResult Delete(Guid id)
        {


            try
            {
                _instituicaoRepository.Deletar(id);

                return NoContent();
            }
            catch (Exception e)
            {

                return BadRequest(e.Message);

            }

        }

        [HttpGet("Listar")]
        [Authorize]
        public IActionResult Get()
        {
            try
            {
                return Ok(_instituicaoRepository.Listar());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(Guid id)
        {
            try
            {


                return Ok(_instituicaoRepository.BuscarPorId(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
                throw;
            }



        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public IActionResult Put(Guid id, Instituicao instituicao)
        {
            try
            {
                _instituicaoRepository.Atualizar(id, instituicao);
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
