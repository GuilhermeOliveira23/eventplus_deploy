using webapi.event_.tarde.Contexts;
using webapi.event_.tarde.Domains;
using webapi.event_.tarde.Interfaces;

namespace webapi.event_.tarde.Repositories
{
    public class InstituicaoRepository : IInstituicaoRepository
    {

        private readonly EventContext ctx;

        public InstituicaoRepository(EventContext context)
        {
            ctx = context;
        }

        public void Cadastrar(Instituicao instituicao)
        {
            try
            {
                ctx.Instituicao.Add(instituicao);
                ctx.SaveChanges();

            }
            catch (Exception)
            {

                throw;
            }
        }

        public void Deletar(Guid id)
        {
            Instituicao instituicaoBuscada = ctx.Instituicao.Find(id)!;
            if (instituicaoBuscada != null)
            {
                ctx.Instituicao.Remove(instituicaoBuscada);
            }
            ctx.SaveChanges();
        }

        public List<Instituicao> Listar()
        {
          return  ctx.Instituicao.ToList();
        }

        public Instituicao BuscarPorId(Guid id)
        {
            return ctx.Instituicao.Find(id)!;
        }

        public void Atualizar(Guid id, Instituicao instituicao)
        {
            Instituicao instituicaoBuscada = ctx.Instituicao.Find(id);
            if (instituicaoBuscada != null)
            {
                instituicaoBuscada.CNPJ = instituicao.CNPJ;
                instituicaoBuscada.Endereco= instituicao.Endereco;
                instituicaoBuscada.NomeFantasia = instituicao.NomeFantasia;

                ctx.SaveChanges();
            }

        }

       

         

       
    }
}
