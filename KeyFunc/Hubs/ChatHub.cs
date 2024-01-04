using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using KeyFunc.Models;
using KeyFunc.Repos;
using System.Collections.Concurrent;
using System.Xml.Linq;

namespace KeyFunc.Hubs
{
	public class ChatHub : Hub
	{
        IUserRepository _userRepository;
        IMessageRepository _messageRepository;

        private readonly static ConnectionMapping<string> _connections =
        new ConnectionMapping<string>();

        public ChatHub(IUserRepository userRepository, IMessageRepository messageRepository)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
        }

        [Authorize]
        public async Task NewMessage(string message, string groupName)
        {
            Console.WriteLine($"new message {message} {groupName}");
            await Clients.Group(groupName).SendAsync("messageReceived",message, groupName);

        }

        [Authorize]
        public async Task SendMessage(string message)
        {
            Console.WriteLine($"SENDING");

            Console.WriteLine(Clients.Group("nice@gmail.com").ToString());
            await Clients.Group("nice@gmail.com").SendAsync("messageReceived", message);

        }

        public async override Task OnConnectedAsync()
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

