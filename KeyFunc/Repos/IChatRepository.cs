using System;
using KeyFunc.Models;
using KeyFunc.Repos;
namespace KeyFunc.Repos
{
	public interface IChatRepository : IRepository<Chat>
	{
		Task<Chat?> GetChatDetails(int Id);
	}
}

