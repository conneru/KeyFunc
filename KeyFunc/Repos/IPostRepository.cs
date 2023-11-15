using System;
using KeyFunc.Models;
using KeyFunc.Repos;
namespace KeyFunc.Repos
{
	public interface IPostRepository : IRepository<Post>
    {
		Task<Post?> GetPostDetails(int Id);
		Task<IEnumerable<Post>?> GetAllUserPosts(int id);
        Task<IEnumerable<Post>?> GetFollowingPosts(User user);


    }
}

