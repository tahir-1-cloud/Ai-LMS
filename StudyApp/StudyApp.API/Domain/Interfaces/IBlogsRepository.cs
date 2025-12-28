using StudyApp.API.Domain.Entities;
using StudyApp.API.Dto;

namespace StudyApp.API.Domain.Interfaces
{
    public interface IBlogsRepository:IBaseRepository<Blogs>
    {

        Task DeleteBlogsAsync(int blogsId);

        Task<BlogDetailsDto> BlogsDetailsAsync(int blogsId);
    }
}
