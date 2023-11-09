using System;
namespace KeyFunc.Models
{
	public class Chat
	{
		public int Id
		{
			get;
		}

		public string Name
		{
			get;set;
		}

		public virtual List<Message> Messages {
			get; set;
		}

        public virtual List<User> Users {
			get; set;
		}

    }
}

