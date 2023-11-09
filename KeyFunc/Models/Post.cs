using System;
namespace KeyFunc.Models
{
	public class Post
	{
		public int Id;

		public int UserId
		{
			get;set;
		}

		public string Description
		{
			get;set;
		}

		public virtual List<Message> Comments
		{
			get;set;
		}

		public virtual List<Image> Images
		{
			get;set;
		}

		public virtual User User
		{
			get;set;
		}
	}
}

