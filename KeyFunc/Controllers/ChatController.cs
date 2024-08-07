﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KeyFunc.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        IChatRepository _chatRepository;
        IUserRepository _userRepository;

        public ChatController(IChatRepository chatRepository, IUserRepository userRepository)
        {
            _chatRepository = chatRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        [Route("all")]
        public async Task<IEnumerable<Chat>?> GetChat([FromBody] User user)
        {
            IEnumerable<Chat>? chat = await _chatRepository.GetChats(user);

            return chat;
        }

        [HttpPost]
        public async Task<Chat> CreateChat([FromBody] Chat chat)
        {
            for (int i = 0; i < chat.Users.Count; i++)
            {
                User u = chat.Users[i];
                User? newUser = await _userRepository.GetById(u.Id);
                chat.Users[i] = newUser;
            }

            _chatRepository.Add(chat);
            await _chatRepository.Save();
            return chat;
        }

        [HttpDelete]
        public void DeleteChat([FromBody] Chat chat)
        {
            _chatRepository.Delete(chat);
            _chatRepository.Save();
        }

        [HttpPut]
        public async Task<Chat> UpdateChat([FromBody] Chat chat)
        {
            Chat newChat = await _chatRepository.Update(chat.Id, chat);

            await _chatRepository.Save();

            return newChat;
        }

        [HttpPost]
        [Route("{id}/user")]
        public async Task<Chat> AddUserToChat(int id, [FromBody] User user)
        {
            Chat? chat = await _chatRepository.GetChatDetails(id);

            User? newUser = await _userRepository.GetById(user.Id);

            chat.Users.Add(newUser);

            await _chatRepository.Save();
            return chat;
        }

        [HttpDelete]
        [Route("{id}/user")]
        public async Task<Chat> DeleteUserFromChat(int id, [FromBody] User user)
        {
            Chat? chat = await _chatRepository.GetChatDetails(id);

            User? newUser = await _userRepository.GetById(user.Id);

            chat.Users.Remove(newUser);

            await _chatRepository.Save();
            return chat;
        }
    }
}
