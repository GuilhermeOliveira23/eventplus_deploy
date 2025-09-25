using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;

namespace webapi.event_.tarde.Repositories
{
    public class TipoUsuarioRepository : ITipoUsuarioRepository
    {
        private readonly EventContext ctx;
        public TipoUsuarioRepository(EventContext context)
        {
            ctx = context;
        }



        public void Atualizar(Guid id, TipoUsuario tipoUsuario)
        {
            TipoUsuario tipoUsuarioBuscado = ctx.TipoUsuario.Find(id)!;
            if (tipoUsuarioBuscado != null)
            {
                tipoUsuarioBuscado.Titulo = tipoUsuario.Titulo;
                ctx.SaveChanges();
            }
        }

        public TipoUsuario BuscarPorId(Guid id)
        {
            return ctx.TipoUsuario.FirstOrDefault(e => e.IdTipoUsuario == id)!;
        }

        public void Cadastrar(TipoUsuario tipoUsuario)
        {
            try
            {
                ctx.TipoUsuario.Add(tipoUsuario);
                ctx.SaveChanges();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Deletar(Guid id)
        {
            TipoUsuario tipoUsuarioBuscado = ctx.TipoUsuario.Find(id)!;
            if (tipoUsuarioBuscado != null)
            {
                ctx.TipoUsuario.Remove(tipoUsuarioBuscado);
            }
            
            ctx.SaveChanges();
        }

        public List<TipoUsuario> Listar()
        {
           return ctx.TipoUsuario.ToList();
        }
    }
}
