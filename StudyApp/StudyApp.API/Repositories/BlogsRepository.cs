using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;

namespace StudyApp.API.Repositories
{
    public class BlogsRepository : BaseRepository<Blogs>, IBlogsRepository
    {
        public BlogsRepository(ApplicationDbContext context) : base(context)
        {

        }

        public async Task DeleteBlogsAsync(int blogsId)
        {
            var blogs = await _context.blogs.FirstOrDefaultAsync(p => p.Id == blogsId);

            if (blogs == null)
            {
                throw new KeyNotFoundException($"Paper with id {blogsId} not found.");
            }

            _context.blogs.Remove(blogs);
            await _context.SaveChangesAsync();
        }
        
        public async Task<BlogDetailsDto> BlogsDetailsAsync(int blogsId)
        {
            try
            {
                var blog = await _context.blogs.Where(x => x.Id == blogsId)
                    .Select(x => new BlogDetailsDto
                        {
                         Title= x.Title,
                         Content= x.Content,
                        }).FirstOrDefaultAsync();
                if (blog == null)
                    throw new KeyNotFoundException($"Blog with ID {blogsId} not found.");

                return blog;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }


}
