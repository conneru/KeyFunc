using System;

namespace KeyFunc.Models
{
    public class Chat
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? Image { get; set; }

        //Type 0: DM, 1:Group chat
        public int Type { get; set; }

        public virtual List<Message>? Messages { get; set; }

        public virtual List<User>? Users { get; set; }
    }
}
