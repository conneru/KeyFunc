using System;
namespace KeyFunc.Models
{
	public class User
	{
		public int Id;

		public string Username
		{
			get;set;
		}

		public string Email
		{
			get;set;
		}

		public string Password
		{
			get;set;
		}

		public DateTime JoinedOn
		{
			get;set;
		}

		public virtual List<UserFollow> Following { get; set; }

		public virtual List<UserFollow> Followers { get; set; }

		public virtual List<Post> Posts { get; set; }

		public virtual List<Chat> Chats { get; set; }

		public virtual Image ProfilePic
		{
			get;set;
		}
	}
}

