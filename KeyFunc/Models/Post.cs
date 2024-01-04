using System;
namespace KeyFunc.Models
{
	public class Post
	{
		public int Id
		{
			get;set;
        }

		public int? UserId
		{
			get;set;
		}

		public string? Description
		{
			get;set;
		}

		public int? Likes
		{
			get;set;
		}

		public DateTime createdAt
		{
			get;set;
		}

		public virtual List<Message>? Comments
		{
			get;set;
		}

		public virtual List<Image>? Images
		{
			get;set;
		}

		public virtual User? User
		{
			get;set;
		}
	}
}

