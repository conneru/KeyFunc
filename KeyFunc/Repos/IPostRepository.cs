using System;
using KeyFunc.Models;
using KeyFunc.Repos;
namespace KeyFunc.Repos
{
	public interface IPostRepository : IRepository<Post>
    {
		Task<Post?> GetPostDetails(int Id);
	}
}

