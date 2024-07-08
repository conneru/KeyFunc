using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Protobuf;
using KeyFunc.DTO;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KeyFunc.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        IMessageRepository _messageRepository;
        IUserRepository _userRepository;

        public MessageController(
            IMessageRepository messageRepository,
            IUserRepository userRepository
        )
        {
            _messageRepository = messageRepository;
            _userRepository = userRepository;
        }

        [HttpPost]
        [Route("more")]
        public async Task<List<MessageDTO>?> GetMessages([FromBody] Message msg)
        {
            List<MessageDTO>? messages = await _messageRepository.getChatMessages(msg);

            await _messageRepository.Save();

            return messages;
        }

        [HttpPost]
        [Route("view")]
        public async Task<MessageDTO?> ViewMessage([FromBody] Message msg)
        {
            try
            {
                User user = await _userRepository.GetUserDetails(msg.UserId);
                Message message = await _messageRepository.getDetailedMessage(msg.Id);

                message.UsersWhoHaveRead.Add(user);

                await _messageRepository.Save();

                return new MessageDTO(message);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return new MessageDTO();
            }
        }

        [HttpPost]
        public async Task<StatusCodeResult> AddMessage([FromBody] Message message)
        {
            message.CreatedAt = DateTime.Now;
            _messageRepository.Add(message);
            await _messageRepository.Save();

            return StatusCode(200);
        }

        [HttpPatch]
        public void UpdateMessage([FromBody] Message message)
        {
            _messageRepository.Update(message.Id, message);
            _messageRepository.Save();
        }

        [HttpDelete]
        public void DeleteMessage(Message message)
        {
            _messageRepository.Delete(message);
            _messageRepository.Save();
        }
    }
}
