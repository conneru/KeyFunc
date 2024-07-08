using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using KeyFunc.Models;
using KeyFunc.Repos;
using KeyFunc.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Pkcs;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=
//

namespace KeyFunc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<User> CreateUser([FromBody] User user)
        {
            PasswordHasher<User> hasher = new();

            User newUser = _userRepository.Add(user);
            newUser.Password = hasher.HashPassword(newUser, newUser.Password);
            newUser.JoinedOn = DateTime.Now;
            await _userRepository.Save();

            return user;
        }

        [HttpPut]
        public async Task<User> UpdateUser([FromBody] User user)
        {
            User newUser = await _userRepository.Update(user.Id, user);
            await _userRepository.Save();

            return newUser;
        }

        [HttpDelete]
        public void DeleteUser([FromBody] User user)
        {
            _userRepository.Delete(user);
            _userRepository.Save();
        }

        [HttpGet]
        [Route("all")]
        public async Task<IEnumerable<User>> GetAllUsers()
        {
            IEnumerable<User?> allUsers = await _userRepository.GetAll();

            return allUsers.ToArray();
        }

        [HttpGet]
        [Route("{username}")]
        public async Task<UserProfileDTO?> GetSingleUser(string username)
        {

            User? user = await _userRepository.GetUserByUsername(username);

            return new UserProfileDTO(user);
        }

        [HttpPost]
        [Route("follow/{username}")]
        public async Task<UserProfileDTO?> FollowUser(string username, [FromBody] User user)
        {

            User? followee = await _userRepository.GetUserByUsername(username);

            User? follower = await _userRepository.GetUserDetails(user.Id);

            followee.Followers.Add(follower);

            await _userRepository.Save();

            return new UserProfileDTO(followee);
        }

        [HttpPost]
        [Route("unfollow/{username}")]
        public async Task<UserProfileDTO?> UnfollowUser(string username, [FromBody] User user)
        {
            User? followee = await _userRepository.GetUserByUsername(username);

            User? follower = await _userRepository.GetUserDetails(user.Id);

            followee.Followers.Remove(follower);

            await _userRepository.Save();

            return new UserProfileDTO(followee);
        }

        [HttpPost]
        [Route("search")]
        public async Task<List<FollowUserDTO>?> SearchForUsers([FromBody] QueryDTO query)
        {
            List<FollowUserDTO> results = new();
            List<User?> foundUsers = await _userRepository.GetMatchingUsers(query);

          foreach(User u in foundUsers) {

                results.Add(new FollowUserDTO(u));
            }

            return results;
        }

        [HttpDelete]
        [Route("chat/{id}")]
        public async Task<User> LeaveChat(int chatId, [FromBody] User user)
        {
            User? u = await _userRepository.GetUserDetails(user.Id);

            Chat chat = u.Chats.Where(c => c.Id == chatId).Single();

            //u.Chats.Remove(chatId);
            _userRepository.Save();

            return u;
        }
    }
}
