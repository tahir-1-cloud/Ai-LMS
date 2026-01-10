using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;

namespace StudyApp.API.Repositories
{
    public class ApplicationUserRepository : BaseRepository<ApplicationUser>, IApplicationUserRepository
    {
        public ApplicationUserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<ApplicationUser?> GetUserByIdAsync(int studentId)
        {
            return await _context.ApplicationUsers.FirstOrDefaultAsync(x => x.Id == studentId);
        }
        public async Task<List<ApplicationUser>> GetUsersBySessionIdAsync(int sessionId)
        {
            return await _context.ApplicationUsers
                .Where(x => x.SessionId == sessionId)
                .ToListAsync();
        }


        public async Task<ApplicationUser?> GetUserByCNIC(string cnic)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.CNIC == cnic);
        }

        public async Task<ApplicationUser?> GetUserByCNICorEmail(string cnic, string email)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.CNIC == cnic || u.EmailAddress == email);
        }

        public async Task<ApplicationUser?> GetUserByEmail(string email)
        {
            return await _context.ApplicationUsers
                .AsNoTracking().FirstOrDefaultAsync(u => u.EmailAddress == email);
        }

        public async Task<ApplicationUser?> FindUserByUniqueFieldsAsync(string cnic, string email, string phone)
        {
            return await _context.ApplicationUsers
                .Include(u => u.Session)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.CNIC == cnic || u.EmailAddress == email || u.PhoneNumber == phone);
        }

        public async Task<ApplicationUser?> FindUserByUserNameAsync(string userName)
        {
            return await _context.ApplicationUsers
                .IgnoreQueryFilters()   // 🔥 IMPORTANT
                .FirstOrDefaultAsync(x =>
                    x.CNIC == userName ||
                    x.EmailAddress == userName ||
                    x.PhoneNumber == userName);
        }

        public async Task<UserLogin?> GetSessionByIdAsync(long loginId)
        {
            return await _context.UserLogins
                .FirstOrDefaultAsync(x => x.Id == loginId);
        }
        public async Task<Session?> GetSessionByUserIdAsync(int userId)
        {
            return await _context.ApplicationUsers
                .IgnoreQueryFilters() // 🔥 bypass global filters
                .Where(x => x.Id == userId)
                .Select(x => x.Session)
                .FirstOrDefaultAsync();
        }



        public async Task ExpireAllSessionsAsync(long userId)
        {
            var sessions = await _context.UserLogins
                .Where(x => x.UserId == userId && x.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            foreach (var session in sessions)
            {
                session.ExpiresAt = DateTime.UtcNow;
                session.IsActive = false;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<int> GetTotalUsersAsync()
        {
            return await _context.ApplicationUsers.CountAsync();
        }
    }
}
