using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IBlogsRepository:IBaseRepository<Blogs>
    {

        Task DeleteBlogsAsync(int blogsId);
    }
}
