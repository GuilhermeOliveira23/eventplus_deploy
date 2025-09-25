using webapi.event_.tarde.Domains;

namespace webapi.event_.tarde.Interfaces
{
    public interface IComentarioEvento
    {
        ComentarioEvento BuscarPorId(Guid id);
        void Cadastrar(ComentarioEvento comentarioEvento);
        void Deletar(Guid id);

        void Atualizar(Guid id, ComentarioEvento comentarioEvento);
        List<ComentarioEvento> Listar();
    }
}
