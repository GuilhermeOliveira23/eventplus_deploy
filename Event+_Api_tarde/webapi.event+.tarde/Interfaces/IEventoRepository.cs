using webapi.event_.tarde.Domains;

namespace webapi.event_.tarde.Interfaces
{
    public interface IEventoRepository
    {

        Evento BuscarPorId(Guid id);
        void Cadastrar(Evento evento);
        void Deletar(Guid id);

        void Atualizar(Guid id, Evento atualizarEvento);
        List<Evento> Listar();

    }
}
