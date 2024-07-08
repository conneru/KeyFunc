using System;
using KeyFunc.Models;

namespace KeyFunc.DTO
{
    public class ChatDTO
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Image { get; set; }

        public int? Type { get; set; }

        public virtual List<MessageDTO>? Messages { get; set; }

        public List<User>? Users { get; set; }

        public ChatDTO(Chat chat)
        {
            Id = chat.Id;
            Name = chat.Name;
            Image = chat.Image;
            Type = chat.Type;
            Messages = new List<MessageDTO>();
            Users = chat.Users;

            foreach (Message m in chat.Messages)
            {
                Messages.Add(new MessageDTO(m));
            }
        }
    }
}
