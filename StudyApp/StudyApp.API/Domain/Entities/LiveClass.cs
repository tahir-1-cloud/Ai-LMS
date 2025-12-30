namespace StudyApp.API.Domain.Entities
{
    public class LiveClass : AuditEntity
    {
        public long Id { get; set; }
        public int SessionId { get; set; }
        public string Title { get; set; }
        public string ZoomMeetingId { get; set; }
        public string StartUrl { get; set; }
        public string JoinUrl { get; set; }
        public string Password { get; set; }
        public DateTime ScheduledAt { get; set; }
        public int DurationMinutes { get; set; }
        public bool IsStarted { get; set; }
        public bool IsEnded { get; set; }
        public Session Session { get; set; }
    }


    public class CreateLiveClassModel
    {
        public int SessionId { get; set; }
        public string Title { get; set; }
        public DateTime ScheduledAt { get; set; }
        public int DurationMinutes { get; set; }
    }

    public class LiveClassModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;

        public DateTime ScheduledAt { get; set; }

        public int DurationMinutes { get; set; }

        public bool IsStarted { get; set; }

        public bool IsEnded { get; set; }
        public string ZoomMeetingId { get; set; } = null!;
        public string StartUrl { get; set; }
        public string Password { get; set; } = null!;
    }
    public class StudentLiveClassModel
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;

        public bool IsStarted { get; set; }

        public bool IsEnded { get; set; }

        public string JoinUrl { get; set; } = null!;
    }



}
