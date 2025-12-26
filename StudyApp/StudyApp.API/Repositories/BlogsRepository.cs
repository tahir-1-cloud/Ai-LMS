using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

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
    }


}
