using System;
using KeyFunc.Models;
using KeyFunc.Data;
using Microsoft.EntityFrameworkCore;
namespace KeyFunc.Repos
{
	public class MessageRepository : Repository<Message>, IMessageRepository
	{
		KeyFuncContext _context;

		public MessageRepository(KeyFuncContext context) : base(context)
		{
			_context = context;
		}
	}
}

