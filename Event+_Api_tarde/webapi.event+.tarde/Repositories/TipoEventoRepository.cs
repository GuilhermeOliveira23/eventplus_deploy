using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;

namespace webapi.event_.tarde.Repositories
{
    public class TipoEventoRepository : ITipoEventoRepository
    {
        private readonly EventContext ctx;

        public TipoEventoRepository(EventContext context)
        {
            ctx = context;
        }

        public void Atualizar(Guid id, TipoEvento atualizarEvento)
        {
            TipoEvento tipoEventoBuscado = ctx.TipoEvento.Find(id);
            if (tipoEventoBuscado != null)
            {
                tipoEventoBuscado.Titulo = atualizarEvento.Titulo;
                ctx.SaveChanges();
            }
        }

        public TipoEvento BuscarPorId(Guid id)
        {
            return ctx.TipoEvento.FirstOrDefault(e => e.IdTipoEvento == id)!;
        }

        public void Cadastrar(TipoEvento tipoEvento)
        {
            try
            {
                ctx.TipoEvento.Add(tipoEvento);
                ctx.SaveChanges();

            }
            catch (Exception)
            {

                throw;
            }
        }

        
        public void Deletar(Guid id)
        {
            TipoEvento tipoEventoBuscado = ctx.TipoEvento.Find(id)!;
            if (tipoEventoBuscado != null)
            {
                ctx.TipoEvento.Remove(tipoEventoBuscado);
            }
            
            ctx.SaveChanges();

        }

        public List<TipoEvento> Listar()
        {
            return ctx.TipoEvento.ToList();
        }

        
    }
}
