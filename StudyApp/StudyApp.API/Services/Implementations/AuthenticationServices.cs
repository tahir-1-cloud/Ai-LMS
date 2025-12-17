using Azure.Core;
using CloudinaryDotNet.Actions;
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

            ApplicationUser? applicationUser =
                await _userRepository.FindUserByUserNameAsync(student.UserName);

            if (applicationUser == null)
                throw new Exception("Invalid Credentials");

            if (applicationUser.IsBlocked)
                throw new Exception("Please contact administration office");

            if (!applicationUser.Password.Equals(student.Password))
                throw new Exception("Invalid Credentials");

            List<UserLogin> activeSessions =
                await _userLoginRepository.GetCurrentActiveSessionAsync(applicationUser.Id);

            if (activeSessions.Count >= 2)
            {
                var sessionsToEnd = activeSessions
                    .OrderByDescending(s => s.ExpiresAt)
                    .Skip(1)
                    .ToList();

                foreach (var oldSession in sessionsToEnd)
                {
                    oldSession.ExpiresAt = DateTime.UtcNow;
                    await _userLoginRepository.UpdateAsync(oldSession);
                }
            }

            string token = GenerateJwtToken(applicationUser);

            int expireMinutes = int.Parse(_config["Jwt:ExpireMinutes"]);
            var expiresAt = DateTime.UtcNow.AddMinutes(expireMinutes);
            // Save session
            var session = new UserLogin
            {
                UserId = applicationUser.Id,
                Token = token,
                ExpiresAt = expiresAt
            };

            await _userLoginRepository.AddAsync(session);

            return new LoginResponse
            {
                FullName = applicationUser.FullName,
                Session = applicationUser.Session.Title,
                EmailAddress=applicationUser.EmailAddress,
                CNIC=applicationUser.CNIC,
                Token = token,
            };
        }

        

        private string GenerateJwtToken(ApplicationUser applicationUser)
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
                        new Claim("session", applicationUser.Session.Title),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_config["Jwt:ExpireMinutes"])),

                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
