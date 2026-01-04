using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class SessionServices : ISessionServices
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly IApplicationUserRepository _userRepository;

        public SessionServices(ISessionRepository sessionRepository, IApplicationUserRepository userRepository)
        {
            _sessionRepository = sessionRepository;
            _userRepository = userRepository;
        }

        public async Task<SessionModel> AddSession(CreateSessionModel request)
        {
            try
            {
                Session session = new Session()
                {
                    Title = request.Title,
                    Description = request.Description,
                    SessionYear = request.SessionYear
                };

                await _sessionRepository.AddAsync(session);

                return session.Adapt<SessionModel>();
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<IEnumerable<SessionModel>> GetActiveSessions()
        {
            try
            {
                IEnumerable<Session> enumerable = await _sessionRepository.GetAllActiveAsync();
                return enumerable.Adapt<IEnumerable<SessionModel>>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<IEnumerable<SessionModel>> GetSessions()
        {
            try
            {
                IEnumerable<Session> enumerable = await _sessionRepository.GetAsync();
                return enumerable.Adapt<IEnumerable<SessionModel>>();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task BlockSessionAsync(int sessionId)
        {
            var session = await _sessionRepository.GetByIdAsync(sessionId);

            if (session == null)
                throw new Exception("Session not found");

            session.IsActive = false;
            session.IsDeleted = true;

            var users = await _userRepository
                .GetUsersBySessionIdAsync(sessionId);

            foreach (var user in users)
            {
                user.IsBlocked = true;
                user.IsActive = false;
            }

            await _sessionRepository.UpdateAsync(session);
            await _userRepository.UpdateRangeAsync(users);
        }

    }
}
