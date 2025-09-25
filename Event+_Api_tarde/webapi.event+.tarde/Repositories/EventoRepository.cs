using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;

namespace webapi.event_.tarde.Repositories
{
    public class EventoRepository : IEventoRepository
    {

        private readonly EventContext ctx;

        public EventoRepository(EventContext context)
        {
            ctx = context;
        }

        public void Atualizar(Guid id, Evento atualizarEvento)
        {
            Evento eventoBuscado = ctx.Evento.Find(id)!;
            if (eventoBuscado != null)
            {
                eventoBuscado.Nome = atualizarEvento.Nome;
                eventoBuscado.Descricao = atualizarEvento.Descricao;
                eventoBuscado.DataEvento = atualizarEvento.DataEvento;
                eventoBuscado.IdTipoEvento = atualizarEvento.IdTipoEvento;
                eventoBuscado.IdInstituicao = atualizarEvento.IdInstituicao;

                ctx.SaveChanges();
            }


        }

        public Evento BuscarPorId(Guid id)
        {
            return ctx.Evento.FirstOrDefault(e => e.IdEvento == id)!;
        }

        public void Cadastrar(Evento evento)
        {
            try
            {
                ctx.Evento.Add(evento);
               ctx.SaveChanges();
               
            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Deletar(Guid id)
        {
            Evento eventoBuscado = ctx.Evento.Find(id)!;
            if (eventoBuscado != null)
            {
                ctx.Evento.Remove(eventoBuscado);
            }
            ctx.SaveChanges();

        }

        public List<Evento> Listar()
        {
            return ctx.Evento.Include(e => e.TipoEvento).Include(e => e.Instituicao).ToList();
        }
    }
}
