using Mapster;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Dto;
using StudyApp.API.Models;
using StudyApp.API.Repositories;
using StudyApp.API.Services.Interfaces;

namespace StudyApp.API.Services.Implementations
{
    public class StudentLectureService:IStudentLectureService
    {
        private readonly IStudentLectureRepository _StudentLectureRepository;
        //private readonly CloudinaryDotNet.Cloudinary _cloudinary;
        private readonly IFileStorageService _fileStorage;

        public StudentLectureService(IStudentLectureRepository studentLectureRepository,IFileStorageService fileStorage  /* CloudinaryDotNet.Cloudinary cloudinary*/)
        {
            _StudentLectureRepository = studentLectureRepository;
            //_cloudinary = cloudinary;
            _fileStorage = fileStorage;
        }


        public async Task CreateLectureAsync(LectureDetailsModel model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model));
            if (model.Thumbnail == null) throw new ArgumentException("Thumbnail is required", nameof(model.Thumbnail));
            if (model.Video == null) throw new ArgumentException("Video is required", nameof(model.Video));

            // Upload thumbnail (image)
            var thumbnailUrl = await _fileStorage.UploadAsync(model.Thumbnail);

            // Upload video
            var videoUrl = await _fileStorage.UploadAsync(model.Video);

            var lecture = new Lecturedetails
            {
                Title = model.Title,
                Description = model.Description,
                ThumbnailUrl= thumbnailUrl,
                VideoUrl = videoUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = 1,
                IsActive = true,
                IsDeleted = false
            };
            await _StudentLectureRepository.AddAsync(lecture);
        }

        //private async Task<string> UploadImageAsync(IFormFile file, string folder)
        //{
        //    if (file == null || file.Length == 0)
        //        return null;

        //    await using var stream = file.OpenReadStream();

        //    var uploadParams = new ImageUploadParams
        //    {
        //        File = new FileDescription(file.FileName, stream),
        //        Folder = folder,
        //        UseFilename = true,
        //        UniqueFilename = true
        //    };

        //    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        //    return uploadResult.SecureUrl?.ToString();
        //}


        //private async Task<string> UploadVideoAsync(IFormFile file, string folder)
        //{
        //    if (file == null || file.Length == 0)
        //        return null;

        //    await using var stream = file.OpenReadStream();

        //    var uploadParams = new VideoUploadParams
        //    {
        //        File = new FileDescription(file.FileName, stream),
        //        Folder = folder,
        //        UseFilename = true,
        //        UniqueFilename = true
        //    };

        //    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
        //    return uploadResult.SecureUrl?.ToString();
        //}

        //Get Lectures Service

        public async Task<IEnumerable<LectureDetailsResponseDto>> GetAllLectures()
        {
            IEnumerable<Lecturedetails> entities = await _StudentLectureRepository.GetAsync();
            var dtos = entities.Adapt<IEnumerable<LectureDetailsResponseDto>>();
            return dtos;
        }

        public async Task AssignLectureToSession(int lectureId, int sessionId)
        {
            await _StudentLectureRepository.AssignLecturesToSessionAsync(lectureId, sessionId);
        }

        public async Task UnassignLectureFromSession(int lectureId, int sessionId)
        {
            var entry = await _StudentLectureRepository.GetLecturesSession(lectureId, sessionId);

            if (entry == null)
                throw new Exception("Lecture is not assigned to this session.");

            await _StudentLectureRepository.RemoveLecturesSession(entry);
        }

        public async Task<List<int>> GetLectureAssignedSessionId(int lectureId)
        {
            if (lectureId <= 0)
                throw new ArgumentException("Invalid lectureId");

            return await _StudentLectureRepository.GetLectureAssignedSessionIdsAsync(lectureId);
        }

        public async Task DeleteLecture(int lectureId)
        {
            await _StudentLectureRepository.DeleteLecturesAsync(lectureId);
        }

        public async Task<List<AssignedLectureDto>> GetAssignedLectures(int sessionId)
        {
            return await _StudentLectureRepository.GetAssignedLecturesAsync(sessionId);
        }
    }
}
