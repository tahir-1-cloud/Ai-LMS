using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;

namespace StudyApp.API.Repositories
{
    public class StudentLectureRepository: BaseRepository<Lecturedetails>, IStudentLectureRepository
    {
        public StudentLectureRepository(ApplicationDbContext context) : base(context)
        {

        }

        public async Task AssignLecturesToSessionAsync(int lectureId, int sessionId)
        {
            // 1️⃣ Validate lecture
            var lecture = await _context.Lecturedetails
                .FirstOrDefaultAsync(l => l.Id == lectureId);

            if (lecture == null)
                throw new KeyNotFoundException($"Lecture with id {lectureId} not found.");

            var sessionExists = await _context.Sessions.AnyAsync(s => s.Id == sessionId);
            if (!sessionExists)
                throw new KeyNotFoundException($"Session with id {sessionId} not found.");

            // 2️⃣ Validate session
        

            // 3️⃣ Get already assigned students (avoid duplicates)
            //var alreadyAssignedStudentIds = await _context.StudentLectures
            //    .Where(sl => sl.LecturedetailId == lectureId)
            //    .Select(sl => sl.StudentId)
            //    .ToListAsync();


            var exists = await _context.StudentLectures
              .AnyAsync(ps => ps.LecturedetailId == lectureId && ps.SessionId == sessionId);

            if (exists)
                return;

            var link = new StudentLecture
            {
                SessionId = sessionId,
                LecturedetailId = lectureId,
                AssignedAt = DateTime.UtcNow
            };

            // 4️⃣ Create assignments
          

            //if (!newAssignments.Any())
            //    return;

            _context.StudentLectures.Add(link);
            await _context.SaveChangesAsync();
        }

    }
}
