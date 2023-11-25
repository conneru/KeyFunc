using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace KeyFunc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private IConfiguration _config;
        private IUserRepository _userRepository;

        public AuthController(IConfiguration config, IUserRepository userRepository)
        {
            _config = config;
            _userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]User user)
        {
            PasswordHasher<User> hasher = new();
            User? foundUser = await _userRepository.GetUserByEmail(user?.Email);

            PasswordVerificationResult validPass = hasher.VerifyHashedPassword(foundUser, foundUser.Password, user.Password);

            if (foundUser == null || validPass == PasswordVerificationResult.Failed) {
                return Unauthorized();
            }


            foundUser.RefreshToken = Convert.ToString( Guid.NewGuid());
            foundUser.RefreshTokenExp = DateTime.Now.AddMinutes(5);

            User updatedUser = await _userRepository.Update(foundUser.Id, foundUser);
            await _userRepository.Save();


            JwtSecurityToken token = GenerateJwt(updatedUser);
            HttpContext.Response.Cookies.Append(
                "X-Access-Token",
                new JwtSecurityTokenHandler().WriteToken(token),
                new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(7),
                    HttpOnly = true
                });
            HttpContext.Response.Cookies.Append(
                "X-Refresh-Token",
                updatedUser.RefreshToken,
                new CookieOptions
                {
                 Expires = DateTime.Now.AddDays(7),
                 HttpOnly = true
                });
            return Ok(updatedUser);
        }

        [HttpGet("refresh")]
        public async Task<IActionResult> Refresh()
        {

            string accessToken = Request.Cookies["X-Access-Token"];
            string refreshToken = Request.Cookies["X-Refresh-Token"];

            var tokenInfo = GetPrincipalFromExpiredToken(accessToken);
            string email = tokenInfo.FindFirst("Name").Value;

            User user = await _userRepository.GetUserByEmail(email);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExp < DateTime.Now)
            {
                return Unauthorized();
            }

            var newToken = GenerateJwt(user);

            HttpContext.Response.Cookies.Append(
                "X-Access-Token",
                new JwtSecurityTokenHandler().WriteToken(newToken),
                new CookieOptions
                {
                    Expires = DateTime.Now.AddDays(7),
                    HttpOnly = true,
                    Secure = true
                });

            return Ok(user);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var key = _config["JwtSettings:Key"] ?? throw new InvalidOperationException("Secret not configured");

            var validation = new TokenValidationParameters
            {
                ValidIssuer = _config["JwtSettings:Issuer"],
                ValidAudience = _config["JwtSettings:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                ValidateLifetime = false
            };

            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }


        private JwtSecurityToken GenerateJwt(User userInfo)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[] {
        new Claim(JwtRegisteredClaimNames.Name, userInfo.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(_config["JwtSettings:Issuer"],
              _config["JwtSettings:Audience"],
              claims,
              expires: DateTime.Now.AddMinutes(1),
              signingCredentials: credentials);

            return token;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];

            using var generator = RandomNumberGenerator.Create();

            generator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }

    }



}

