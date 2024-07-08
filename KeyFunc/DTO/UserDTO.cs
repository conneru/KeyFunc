using System;
using KeyFunc.Models;

namespace KeyFunc.DTO
{
    public class UserDTO
    {
        public int Id { get; set; }

        public string? Username { get; set; }

        public string? Email { get; set; }

        public DateTime? JoinedOn { get; set; }

        public string? ProfilePic { get; set; }

        public virtual Dictionary<int,FollowUserDTO>? Following { get; set; }

        public virtual Dictionary<int, FollowUserDTO>? Followers { get; set; }

        public virtual List<Post>? Posts { get; set; }

        public List<ChatDTO>? Chats { get; set; }

        public UserDTO(User user)
        {
            Id = user.Id;
            Username = user.Username;
            Email = user.Email;
            JoinedOn = user.JoinedOn;
            ProfilePic = user.ProfilePic;
            Following = new();
            Followers = new();
            Posts = user.Posts;
            Chats = new List<ChatDTO>();

            foreach (Chat c in user.Chats)
            {
                Chats.Add(new ChatDTO(c));
            }

            foreach (User u in user.Followers) {
                Followers.Add(u.Id, new FollowUserDTO(u));
            }
            foreach (User u in user.Following)
            {
                Following.Add(u.Id, new FollowUserDTO(u));
            }
        }
    }
}
