using webapi.event_.tarde.Domains;

namespace webapi.event_.tarde.Interfaces
{
    public interface IPresencaEvento
    {

        List<PresencaEvento> BuscarPorId(Guid id);
        void Cadastrar(PresencaEvento presencaEvento);
        void Deletar(Guid id);

        void Atualizar(Guid id, PresencaEvento presencaEvento);
        List<PresencaEvento> Listar();
    }
}
