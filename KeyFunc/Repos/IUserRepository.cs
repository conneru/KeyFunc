using System;
using KeyFunc.Models;
namespace KeyFunc.Repos
{
	public interface IUserRepository : IRepository<User>
	{
		Task<User?> GetUserByEmail(string email);

		Task<User?> GetUserDetails(User user);


	}
}

