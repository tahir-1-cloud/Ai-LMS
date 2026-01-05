using StudyApp.API.Domain.Entities;

namespace StudyApp.API.Domain.Interfaces
{
    public interface ISessionRepository : IBaseRepository<Session>
    {
        Task<IEnumerable<Session>> GetAllActiveAsync();
        Task<List<ApplicationUser>> GetUsersBySessionIdAsync(int sessionId);
    }
}
