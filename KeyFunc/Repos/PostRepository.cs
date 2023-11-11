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
			Post? post = await _context.Posts.Where(p => p.Id == Id).Include(p=>p.Comments).Include(p=>p.User).Include(p=>p.Images).SingleAsync();

			return post;
		}
	}
}

