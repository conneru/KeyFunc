using System;

namespace KeyFunc.Models
{
    public class User
    {
        public int Id { get; set; }

        public string? Username { get; set; }

        public string? Email { get; set; }

        public string? Password { get; set; }

        public DateTime? JoinedOn { get; set; }

        public string? ProfilePic { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExp { get; set; }

        public virtual List<User>? Following { get; set; }

        public virtual List<User>? Followers { get; set; }

        public virtual List<Post>? Posts { get; set; }

        public virtual List<Chat>? Chats { get; set; }

        public virtual List<Message>? Messages { get; set; }

        public virtual List<Message>? MessagesRead { get; set; }
    }
}
