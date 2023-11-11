using System;
using KeyFunc.Models;
namespace KeyFunc.Repos
{
	public interface IChatRepository
	{
		Task<Chat?> GetChatDetails(int Id);
	}
}

