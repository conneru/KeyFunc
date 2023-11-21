using System;
using KeyFunc.Models;
using KeyFunc.Data;
using Microsoft.EntityFrameworkCore;
namespace KeyFunc.Repos
{
	public class PostRepository : Repository<Post>, IPostRepository
	{
		KeyFuncContext _context;

		public PostRepository(KeyFuncContext context):base(context)
		{
			_context = context;
		}

		public async Task<Post?> GetPostDetails(int Id)
		{
			Post? post = await _context.Posts.Where(p => p.Id == Id).Include(p=>p.Comments).Include(p=>p.User).Include(p=>p.Images.OrderBy(i=>i.OrderNum)).SingleAsync();

			return post;
		}

		public async Task<IEnumerable<Post>?> GetAllUserPosts(int id)
		{
			List<Post>? userPosts = await _context.Posts.Where(p => p.UserId == id).ToListAsync();

			return userPosts;
		}

		public async Task<IEnumerable<Post>?> GetFollowingPosts(User user)
		{
			User u = await _context.Users.Where(u => u.Id == user.Id).SingleAsync();
			List<Post>? followerPosts = await _context.Posts.Where(p => p.User.Followers.Contains(u)).Include(p=>p.User).Include(p=>p.Images).Include(p=>p.Comments).ToListAsync();

			return followerPosts;
		}
	}
}

