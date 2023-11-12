﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KeyFunc.Models;
using KeyFunc.Repos;
using System.Text.Json;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=
//
public class test
{
    public string Id
    {
        get;set;
    }
}

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

        [HttpGet]
        [Route("all")]
        public async Task<IEnumerable<User>> GetAllUsers()
        {

            IEnumerable<User?> allUsers = await _userRepository.GetAll();


            return allUsers.ToArray();
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<User?> GetSingleUser(int Id)
        {
            User? user = await _userRepository.GetUserDetails(Id);

            return user;
        }

        [HttpPost]
        [Produces("application/json")]
        [Route("follow/{id}")]
        public async Task<User?> FollowUser(int id ,[FromBody] User f)
        {
            //Console.WriteLine($"{user.Id} {user.Username}");
            User? followee = await _userRepository.GetUserDetails(id);

            User? follower = await _userRepository.GetUserDetails(f.Id);

            followee.Followers.Add(follower);

            _userRepository.Save();

            return followee;

        }
    }
}
