namespace StudyApp.API.Models
{
    public class BunnySettings
    {
        public string StorageZoneName { get; set; }
        public string AccessKey { get; set; }     // ✅ correct name
        public string StorageHost { get; set; }   // ✅ needed
        public string CdnUrl { get; set; }
    }
}
