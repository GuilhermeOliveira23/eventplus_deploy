using webapi.event_.tarde.Domains;

namespace webapi.event_.tarde.Interfaces
{
    public interface IUsuarioRepository
    {
        void Cadastrar(Usuario usuario);

        Usuario BuscarPorId(Guid id);

        Usuario BuscarPorEmailSenha(string email, string senha);

        void Deletar(Guid id);

        void Atualizar(Guid id, Usuario usuario);

        List<Usuario> Listar();

        



    }
}
