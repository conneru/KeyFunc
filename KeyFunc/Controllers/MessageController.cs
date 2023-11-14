using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KeyFunc.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        IMessageRepository _messageRepository;

        public MessageController(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }


        [HttpPost]
        public void AddMessage(int id, [FromBody] Message message)
        {
            _messageRepository.Add(message);
            _messageRepository.Save();
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

