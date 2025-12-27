namespace StudyApp.API.Domain.Entities
{
    public class LiveClass : AuditEntity
    {
        public long Id { get; set; }

        public long SessionId { get; set; }

        public string Title { get; set; }
        public string MeetingNumber { get; set; }
        public string Password { get; set; }

        public DateTime ScheduledAt { get; set; }
        public int DurationMinutes { get; set; }

        public bool IsStarted { get; set; }
        public bool IsEnded { get; set; }

        public Session Session { get; set; }
    }
}
