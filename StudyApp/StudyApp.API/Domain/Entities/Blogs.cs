
namespace StudyApp.API.Domain.Entities
{
    public class Blogs : AuditEntity
    {
        public string Title { get; set; }
        public string ShortDescription { get; set; }

        public string Content { get; set; }
        public string ImageUrl { get; set; }

       
    }
}
