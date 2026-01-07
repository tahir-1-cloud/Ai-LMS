using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class LiveClassService : ILiveClassService
    {
        private readonly ApplicationDbContext _context;
        private readonly ZoomMeetingService _zoomMeetingService;

        public LiveClassService(
            ApplicationDbContext context,
            ZoomMeetingService zoomMeetingService)
        {
            _context = context;
            _zoomMeetingService = zoomMeetingService;
        }

        public async Task CreateLiveClassAsync(CreateLiveClassModel model)
        {
            // 1️⃣ Validate session
            var sessionExists = await _context.Sessions
                .AnyAsync(x => x.Id == model.SessionId);

            if (!sessionExists)
                throw new Exception("Invalid SessionId");

            // 2️⃣ Convert PKT → UTC (SAFE)
            var pakistanTz = GetPakistanTimeZone();

            var localPkTime = DateTime.SpecifyKind(
                model.ScheduledAt,
                DateTimeKind.Unspecified);

            var scheduledUtc =
                TimeZoneInfo.ConvertTimeToUtc(localPkTime, pakistanTz);

            var newStart = scheduledUtc;
            var newEnd = scheduledUtc.AddMinutes(model.DurationMinutes);

            // 3️⃣ Prevent overlapping schedules
            var overlapExists = await _context.LiveClasses.AnyAsync(x =>
                x.SessionId == model.SessionId &&
                !x.IsEnded &&
                newStart < x.ScheduledAt.AddMinutes(x.DurationMinutes) &&
                newEnd > x.ScheduledAt
            );

            if (overlapExists)
                throw new Exception(
                    "Another live class is already scheduled during this time for this session");

            // 4️⃣ Create Zoom meeting (UTC)
            var zoom = await _zoomMeetingService.CreateMeetingAsync(
                model.Title,
                scheduledUtc,
                model.DurationMinutes
            );

            // 5️⃣ Save (UTC ONLY)
            var entity = new LiveClass
            {
                SessionId = model.SessionId,
                Title = model.Title,

                ZoomMeetingId = zoom.id,
                StartUrl = zoom.startUrl,
                JoinUrl = zoom.joinUrl,
                Password = zoom.password,

                ScheduledAt = scheduledUtc,
                DurationMinutes = model.DurationMinutes,

                IsStarted = false,
                IsEnded = false
            };

            _context.LiveClasses.Add(entity);
            await _context.SaveChangesAsync();
        }
        private static TimeZoneInfo GetPakistanTimeZone()
        {
            try
            {
                // Linux / Docker / Cloud
                return TimeZoneInfo.FindSystemTimeZoneById("Asia/Karachi");
            }
            catch (TimeZoneNotFoundException)
            {
                // Windows
                return TimeZoneInfo.FindSystemTimeZoneById("Pakistan Standard Time");
            }
        }


        public async Task StartLiveClassAsync(int liveClassId)
        {
            var liveClass = await _context.LiveClasses
                .FirstOrDefaultAsync(x => x.Id == liveClassId);

            if (liveClass == null)
                throw new InvalidOperationException("Live class not found");

            if (liveClass.IsEnded)
                throw new InvalidOperationException("Live class already ended");

            // ⏱️ Allow start within 5 minutes window
            if (DateTime.UtcNow < liveClass.ScheduledAt.AddMinutes(-5))
                throw new InvalidOperationException(
                    "You can only start the class within 5 minutes of its scheduled time"
                );

            var alreadyRunning = await _context.LiveClasses.AnyAsync(x =>
                x.SessionId == liveClass.SessionId &&
                x.IsStarted &&
                !x.IsEnded &&
                x.Id != liveClassId);

            if (alreadyRunning)
                throw new InvalidOperationException(
                    "Another live class is already running for this session"
                );

            liveClass.IsStarted = true;
            await _context.SaveChangesAsync();
        }


        public async Task EndLiveClassAsync(int liveClassId)
        {
            var liveClass = await _context.LiveClasses.FindAsync(liveClassId);

            if (liveClass == null)
                throw new Exception("Live class not found");

            if (!liveClass.IsStarted)
                throw new Exception("Live class has not started");

            liveClass.IsEnded = true;
            await _context.SaveChangesAsync();
        }

        public async Task<StudentLiveClassModel?> GetActiveLiveClassForSession(int sessionId)
        {
            return await _context.LiveClasses
                .Where(x =>
                    x.SessionId == sessionId &&
                    x.IsStarted &&
                    !x.IsEnded)
                .Select(x => new StudentLiveClassModel
                {
                    Id = (int)x.Id,
                    Title = x.Title,
                    IsStarted = x.IsStarted,
                    IsEnded = x.IsEnded,
                    JoinUrl = x.JoinUrl
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<LiveClassModel>> GetLiveClassesForSessionAsync(int sessionId, int studentId)
        {
            // 1️⃣ Get student's session
            var sessionIdnew = await _context.ApplicationUsers
                .Where(se => se.Id == studentId && !se.IsDeleted)
                .Select(se => se.SessionId)
                .FirstOrDefaultAsync();

            if (sessionIdnew == 0)
                throw new Exception("Student is not enrolled in any session");

            // 2️⃣ Fetch live classes for that session
            return await _context.LiveClasses
                .Where(x =>
                    x.SessionId == sessionIdnew &&
                    !x.IsDeleted &&
                    x.IsActive)
                .OrderBy(x => x.ScheduledAt)
                .Select(x => new LiveClassModel
                {
                    Id = (int)x.Id,
                    Title = x.Title,
                    ScheduledAt = x.ScheduledAt,
                    DurationMinutes = x.DurationMinutes,
                    IsStarted = x.IsStarted,
                    IsEnded = x.IsEnded,

                    // Students ONLY need Join URL
                    JoinUrl = x.JoinUrl
                })
                .ToListAsync();
        }

        public async Task<List<LiveClassModel>> GetLiveClassesForSession_Admin(int sessionId)
        {
            // 1️⃣ Validate session exists
            var sessionExists = await _context.Sessions
                .AnyAsync(s => s.Id == sessionId && !s.IsDeleted);

            if (!sessionExists)
                throw new Exception("Invalid session");

            // 2️⃣ Fetch live classes for this session
            return await _context.LiveClasses
                .Where(x =>
                    x.SessionId == sessionId &&
                    !x.IsDeleted &&
                    x.IsActive)
                .OrderBy(x => x.ScheduledAt)
                .Select(x => new LiveClassModel
                {
                    Id = (int)x.Id,
                    Title = x.Title,
                    ScheduledAt = x.ScheduledAt,
                    DurationMinutes = x.DurationMinutes,
                    IsStarted = x.IsStarted,
                    IsEnded = x.IsEnded,

                    // Admin DOES NOT need JoinUrl
                    JoinUrl = x.JoinUrl,
                    StartUrl = x.StartUrl
                })
                .ToListAsync();
        }

        public async Task DeleteLiveClassAsync(int liveClassId)
        {
            var liveClass = await _context.LiveClasses.FindAsync(liveClassId);

            if (liveClass == null)
                throw new Exception("Live class not found");

            if (!liveClass.IsEnded)
                throw new Exception("Only ended classes can be deleted");

            _context.LiveClasses.Remove(liveClass);
            await _context.SaveChangesAsync();
        }




    }
}
