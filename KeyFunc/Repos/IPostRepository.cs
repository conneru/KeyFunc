using System;
using KeyFunc.Models;
namespace KeyFunc.Repos
{
	public interface IPostRepository
	{
		Task<Post?> GetPostDetails(int Id);
	}
}

