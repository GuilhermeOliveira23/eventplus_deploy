using webapi.event_.tarde.Domains;

namespace webapi.event_.tarde.Interfaces
{
    public interface ITipoEventoRepository
    {
        TipoEvento BuscarPorId(Guid id);
        void Cadastrar(TipoEvento evento);
        void Deletar(Guid id);

        void Atualizar(Guid id, TipoEvento atualizarEvento);
        List<TipoEvento> Listar();
    }
}
