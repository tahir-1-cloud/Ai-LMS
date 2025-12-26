namespace StudyApp.API.Models
{
    public class BlogsModel
    {

        public string Title { get; set; }
        public string ShortDescription { get; set; }

        public string Content { get; set; }
        public IFormFile Image { get; set; }
    }
}
