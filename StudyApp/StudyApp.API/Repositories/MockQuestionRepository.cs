using Microsoft.EntityFrameworkCore;
using StudyApp.API.Data;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Migrations;

namespace StudyApp.API.Repositories
{
    public class MockQuestionRepository : BaseRepository<MockQuestion>, IMockQuestionRepository
    {
        public MockQuestionRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<MockQuestion> AddMockQuestionWithOptionsAsync(MockQuestion question)
        {
            _context.Set<MockQuestion>().Add(question);
            await _context.SaveChangesAsync();
            return question;
        }
        public async Task<List<MockQuestion>> GetMockQuestionsByPaperIdAsync(int MockpaperId)
        {
            return await _context.Set<MockQuestion>()
                .Where(q => q.MockTestId == MockpaperId)
                .Include(q => q.MockOptions)
                .ToListAsync();
        }

        public async Task DeleteMockQuestionAsync(int mockquestionId)
        {
            var mockquestion = await _context.MockQuestions
                .Include(q => q.MockOptions)
                .FirstOrDefaultAsync(q => q.Id == mockquestionId);

            if (mockquestion == null)
                throw new KeyNotFoundException($"Question with id {mockquestionId} not found.");

            // 1️⃣ Delete TestResultAnswers linked to this question
            var answers = await _context.TestResultAnswers
                .Where(a => a.QuestionId == mockquestionId)
                .ToListAsync();

            if (answers.Any())
                _context.TestResultAnswers.RemoveRange(answers);

            // Delete main TestResult
            _context.MockQuestions.Remove(mockquestion);

            await _context.SaveChangesAsync();

        
        }

    }
}
