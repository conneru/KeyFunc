using System;
namespace KeyFunc.Models
{
	public class Message
	{
		public int Id
		{
			get; set;
        }

		public int UserId
		{
			get;set;
		}

		public string Content
		{
			get; set;
		}

		public DateTime CreatedAt
		{
			get; set;
		}

		public bool Edited
		{
			get; set;
		}

		public virtual Chat Chat
		{
			get; set;
		}

		public virtual User User
		{
			get;set;
		}

		public virtual Post Post
		{
			get;set;
		}
	}
}

