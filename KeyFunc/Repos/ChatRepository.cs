using System;
using KeyFunc.Models;
using KeyFunc.Data;
using Microsoft.EntityFrameworkCore;
namespace KeyFunc.Repos
{
	public class ChatRepository : Repository<Chat>, IChatRepository
	{
		KeyFuncContext _context;

		public ChatRepository(KeyFuncContext context):base(context)
		{
			_context = context;
		}

		public async Task<Chat?> GetChatDetails(int Id)
		{
			Chat? chat = await _context.Chats.Where(c => c.Id == Id).Include(c => c.Messages).Include(c => c.Users).SingleAsync();


			return chat;
		}
	}
}

