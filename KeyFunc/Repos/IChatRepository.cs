using System;
using KeyFunc.Models;
using KeyFunc.Repos;
namespace KeyFunc.Repos
{
	public interface IChatRepository : IRepository<Chat>
	{
		Task<IEnumerable<Chat>?> GetChats(User user);
        Task<Chat?> GetChatDetails(int Id);

    }
}

