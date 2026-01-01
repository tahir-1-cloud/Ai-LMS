namespace StudyApp.API.Dto
{
    public class AssignedLectureDto
    {
        public int LectureId { get; set; }
        public string LectureTitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string? ThumbnailUrl { get; set; }

        public int SessionId { get; set; }
        public string SessionTitle { get; set; } = string.Empty;

        public DateTime AssignedAt { get; set; } 

    }
}
