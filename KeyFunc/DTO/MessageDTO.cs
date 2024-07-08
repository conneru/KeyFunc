using System;
using KeyFunc.Models;

namespace KeyFunc.DTO
{
    public class MessageUserDTO
    {
        public int? Id { get; set; }

        public string? Username { get; set; }

        public string? ProfilePic { get; set; }

        public MessageUserDTO(User? user)
        {
            Id = user.Id;
            Username = user.Username;
            ProfilePic = user.ProfilePic;
        }
    }

    public class MessageDTO
    {
        public int Id { get; set; }

        public int? PostId { get; set; }

        public int? ChatId { get; set; }

        public string Content { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool? Edited { get; set; }

        public virtual MessageUserDTO? User { get; set; }

        public virtual List<int>? UsersWhoHaveRead { get; set; }

        public MessageDTO() { }

        public MessageDTO(Message message)
        {
            Id = message.Id;
            PostId = message.PostId;
            ChatId = message.ChatId;
            Content = message.Content;
            CreatedAt = message.CreatedAt;
            Edited = message.Edited;
            User = new MessageUserDTO(message.User);
            UsersWhoHaveRead = new List<int>();

            foreach (User u in message.UsersWhoHaveRead)
            {
                UsersWhoHaveRead.Add(u.Id);
            }
        }
    }
}
