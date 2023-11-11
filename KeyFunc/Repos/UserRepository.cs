using System;
using Microsoft.EntityFrameworkCore;
using KeyFunc.Models;
using KeyFunc.Data;
namespace KeyFunc.Repos
{
	public class UserRepository : Repository<User>,IUserRepository
	{

		KeyFuncContext _context;

		public UserRepository(KeyFuncContext context):base(context)
		{
			_context = context;
		}


        public async Task<User?> GetUserByEmail(string email)
		{
			User? user = await _context.Users.Where(u => u.Email == email).SingleAsync();

			return user;
		}

        public async Task<User?> GetUserDetails(User user)
		{
            User? foundUser = await _context.Users.Where(u=> u.Id == user.Id).Include(u => u.Followers).Include(u => u.Following).Include(u=>u.Posts).SingleAsync();

            return foundUser;
        }



    }


}

