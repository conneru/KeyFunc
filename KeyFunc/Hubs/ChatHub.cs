using System.Collections.Concurrent;
using System.Text.Json;
using System.Xml.Linq;
using Google.Protobuf;
using KeyFunc.DTO;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace KeyFunc.Hubs
{
    public class ChatHub : Hub
    {
        IUserRepository _userRepository;
        IMessageRepository _messageRepository;

        private static readonly ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();

        public ChatHub(IUserRepository userRepository, IMessageRepository messageRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        //[Authorize]
        //public async Task ViewedMessages(Chat chat,User user, string name)
        //{

        //    _messageRepository.
        //    await Clients.Group(name).SendAsync("messagesViewed",message, groupName);

        //}

        [Authorize]
        public async Task SendMessage(Message msg, User user, string group)
        {
            User u = await _userRepository.GetUserDetails(user.Id);
            msg.CreatedAt = DateTime.Now;
            msg.UsersWhoHaveRead = new List<User> { u };

            Message newMsg = _messageRepository.Add(msg);
            await _messageRepository.Save();

            newMsg = await _messageRepository.getDetailedMessage(newMsg.Id);

            await Clients.Group(group).SendAsync("messageReceived", new MessageDTO(newMsg));
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? e)
        {
            var name = Context.User.Identity.Name;

            Console.WriteLine($"{Context.ConnectionId} DISCONNECTED");

            if (name != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, name);
            }

            await base.OnDisconnectedAsync(e);
        }

        [Authorize]
        public async Task JoinGroup()
        {
            var name = Context.User.Identity.Name;

            Console.WriteLine($"Connecting {name} with cID:{Context.ConnectionId}");
            await Groups.AddToGroupAsync(Context.ConnectionId, name);

            User user = await _userRepository.GetUserByEmail(name);

            foreach (Chat c in user.Chats)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, c.Name);
            }
        }
    }
}
