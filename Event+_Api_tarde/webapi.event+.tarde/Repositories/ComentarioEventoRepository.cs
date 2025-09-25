using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;

namespace webapi.event_.tarde.Repositories
{
    public class ComentarioEventoRepository : IComentarioEvento
    {

        private readonly EventContext ctx;

        public ComentarioEventoRepository(EventContext context)
        {
            ctx = context;
        }



        public void Atualizar(Guid id, ComentarioEvento comentarioEvento)
        {
            ComentarioEvento comentarioEventoBuscado = ctx.ComentarioEvento.Find(id)!;
            if (comentarioEventoBuscado != null)
            {
                comentarioEventoBuscado.Descricao = comentarioEvento.Descricao;
                comentarioEventoBuscado.Exibe = comentarioEvento.Exibe;
                comentarioEventoBuscado.IdUsuario = comentarioEvento.IdUsuario;
                comentarioEventoBuscado.IdEvento = comentarioEvento.IdEvento;
            
                
                ctx.SaveChanges();
            }

        }

        public ComentarioEvento BuscarPorId(Guid id)
        {
           return ctx.ComentarioEvento.Find(id)!;
        }

        public void Cadastrar(ComentarioEvento comentarioEvento)
        {
            ctx.ComentarioEvento.Add(comentarioEvento);
            ctx.SaveChanges();
        }

        public void Deletar(Guid id)
        {
            ComentarioEvento comentarioEventoBuscado = ctx.ComentarioEvento.Find(id)!;
            if (comentarioEventoBuscado != null)
            {
                ctx.ComentarioEvento.Remove(comentarioEventoBuscado);
                ctx.SaveChanges();
            }
        }

        public List<ComentarioEvento> Listar()
        {
           return  ctx.ComentarioEvento.ToList();
        }
    }
}
