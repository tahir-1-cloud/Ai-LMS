using Azure.Core;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudyApp.API.Domain.Entities;
using StudyApp.API.Domain.Enums;
using StudyApp.API.Domain.Interfaces;
using StudyApp.API.Models;
using StudyApp.API.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudyApp.API.Services.Implementations
{
    public class AuthenticationServices : IAuthenticationServices
    {
        private readonly IApplicationUserRepository _userRepository;
        private readonly IUserLoginRepository _userLoginRepository;
        private readonly IConfiguration _config;

        public AuthenticationServices(IApplicationUserRepository userRepository, IUserLoginRepository userLoginRepository, IConfiguration config)
        {
            _userRepository = userRepository;
            _userLoginRepository = userLoginRepository;
            _config = config;

        }

        public async Task<CreateApplicationUserModel> AddNewStudent(CreateApplicationUserModel student)
        {
            if (string.IsNullOrWhiteSpace(student.FullName))
            {
                throw new Exception("Name is required");
            }

            if (string.IsNullOrWhiteSpace(student.CNIC))
            {
                throw new Exception("CNIC is required");
            }

            if (string.IsNullOrWhiteSpace(student.EmailAddress))
            {
                throw new Exception("EmailAddress is required");
            }

            if (string.IsNullOrWhiteSpace(student.Password))
            {
                throw new Exception("Password is required");
            }

            ApplicationUser? applicationUser = await _userRepository.FindUserByUniqueFieldsAsync(
                student.CNIC,
                student.EmailAddress,
                student.PhoneNumber
            );

            if (applicationUser != null)
            {
                if (applicationUser.CNIC == student.CNIC)
                    throw new Exception($"Student already exists with CNIC '{student.CNIC}'");

                if (applicationUser.EmailAddress == student.EmailAddress)
                    throw new Exception($"Student already exists with email '{student.EmailAddress}'");

                if (applicationUser.PhoneNumber == student.PhoneNumber)
                    throw new Exception($"Student already exists with phone number '{student.PhoneNumber}'");
            }

            applicationUser = student.Adapt<ApplicationUser>();
            
            applicationUser.RoleId = (int)Roles.Student;
            await _userRepository.AddAsync(applicationUser);

            return applicationUser.Adapt<CreateApplicationUserModel>();
        }

        public async Task<IEnumerable<ApplicationUserModel>> GetAllStudent()
        {
            IEnumerable<ApplicationUser> enumerable = await _userRepository.GetAsync();
            return enumerable.Adapt<IEnumerable<ApplicationUserModel>>();
        }


        public async Task<LoginResponse> LoginStudent(LoginModel student)
        {
            if (string.IsNullOrWhiteSpace(student.UserName))
                throw new Exception("At least one of CNIC, Email Address, or Phone Number is required.");

            if (string.IsNullOrWhiteSpace(student.Password))
                throw new Exception("Password is required");

            var applicationUser =
                await _userRepository.FindUserByUserNameAsync(student.UserName);

            if (applicationUser == null)
                throw new Exception("Invalid Credentials");

            if (applicationUser.IsBlocked)
                throw new Exception("Account blocked. Please contact the administration.");

            if (!applicationUser.Password.Equals(student.Password))
                throw new Exception("Invalid Credentials");

            // 🔐 enforce max 2 sessions
            var activeSessions =
                await _userLoginRepository.GetCurrentActiveSessionAsync(applicationUser.Id);

            if (activeSessions.Count >= 2)
            {
                // Expire ONLY the oldest session
                var oldestSession = activeSessions.First();

                oldestSession.ExpiresAt = DateTime.UtcNow;
                await _userLoginRepository.UpdateAsync(oldestSession);
            }


            int expireMinutes = int.Parse(_config["Jwt:ExpireMinutes"]);
            var expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);

            // ✅ create DB session FIRST
            var session = new UserLogin
            {
                UserId = applicationUser.Id,
                ExpiresAt = expiresAt,
                Token = Guid.NewGuid().ToString() // temporary junk
            };

            await _userLoginRepository.AddAsync(session);

            var getsession = await _userRepository.GetSessionByUserIdAsync(applicationUser.Id);
            applicationUser.Session= getsession;

            // ✅ generate token WITH session id
            var token = GenerateJwtToken(applicationUser, session.Id);

            // ✅ update token in DB
            session.Token = token;
            await _userLoginRepository.UpdateAsync(session);

            return new LoginResponse
            {
                FullName = applicationUser.FullName,
                Session = applicationUser.Session.Title,
                EmailAddress = applicationUser.EmailAddress,
                CNIC = applicationUser.CNIC,
                Token = token
            };
        }

        private string GenerateJwtToken(ApplicationUser applicationUser, long loginId)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                        new Claim(ClaimTypes.NameIdentifier, applicationUser.Id.ToString()),
                        new Claim("fullName", applicationUser.FullName),
                        new Claim("cnic", applicationUser.CNIC),
                        new Claim("emailaddress", applicationUser.EmailAddress),
                        new Claim("sessionId", applicationUser.SessionId.ToString()),
                        new Claim("session", applicationUser.Session.Title),

                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_config["Jwt:ExpireMinutes"])
                ),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<bool> SetStudentBlockStatusAsync(int studentId, bool isBlocked)
        {
            var student = await _userRepository.GetUserByIdAsync(studentId);

            if (student == null)
                return false;

            // No unnecessary DB update
            if (student.IsBlocked == isBlocked)
                return true;

            student.IsBlocked = isBlocked;
            await _userRepository.UpdateAsync(student);

            if (isBlocked)
            {
                await _userRepository.ExpireAllSessionsAsync(studentId);
            }

            return true;
        }
        public async Task<bool> LogoutAsync(ClaimsPrincipal user)
        {
            var loginIdClaim = user.FindFirst("loginId");

            if (loginIdClaim == null)
                return false;

            long loginId = long.Parse(loginIdClaim.Value);

            var session = await _userRepository.GetSessionByIdAsync(loginId);

            if (session == null)
                return false;

            session.ExpiresAt = DateTime.UtcNow;
            session.IsActive = false;

            await _userLoginRepository.UpdateAsync(session);

            return true;
        }


        public async Task<int> GetTotalstudents()
        {
            return await _userRepository.GetTotalUsersAsync();
        }
    }
}
