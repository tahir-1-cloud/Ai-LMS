namespace StudyApp.API.Models
{
    public class LoginResponse
    {
        public string FullName { get; set; }
        public string Session { get; set; }
        public string Token { get; set; }

        public string EmailAddress { get; set; }

        public string CNIC { get; set; }
    }
}
