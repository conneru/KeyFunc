using System;
using KeyFunc.Data;
using KeyFunc.DTO;
using KeyFunc.Models;
using Microsoft.EntityFrameworkCore;

namespace KeyFunc.Repos
{
    public class MessageRepository : Repository<Message>, IMessageRepository
    {
        KeyFuncContext _context;

        public MessageRepository(KeyFuncContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<Message?> getDetailedMessage(int Id)
        {
            Message? message = await _context
                .Messages.Where(m => m.Id == Id)
                .Include(m => m.User)
                .Include(m => m.UsersWhoHaveRead)
                .SingleAsync();

            return message;
        }

        public async Task<List<MessageDTO>?> getChatMessages(Message prevMsg)
        {
            User u = await _context
                .Users.Where(u => u.Id == prevMsg.UserId)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Posts)
                .SingleAsync();

            MessageDTO endMsg = new MessageDTO();
            endMsg.Id = 0;
            endMsg.ChatId = prevMsg.ChatId;
            endMsg.CreatedAt = DateTime.Now.AddYears(20);
            endMsg.Content = "END MESSAGES";
            endMsg.User = null;

            List<Message>? messages = await _context
                .Messages.Where(m => m.ChatId == prevMsg.ChatId)
                .Where(c => c.CreatedAt <= prevMsg.CreatedAt)
                .OrderByDescending(m => m.CreatedAt)
                .Include(c => c.User)
                .Include(m => m.UsersWhoHaveRead)
                .Take(50)
                .ToListAsync();

            List<MessageDTO>? messageDTOs = new List<MessageDTO>();

            foreach (Message m in messages)
            {
                if (m.UsersWhoHaveRead != null && !m.UsersWhoHaveRead.Contains(u))
                {
                    m.UsersWhoHaveRead.Add(u);
                }
                else if (!m.UsersWhoHaveRead.Contains(u))
                {
                    m.UsersWhoHaveRead = new List<User>() { u };
                }

                messageDTOs.Add(new MessageDTO(m));
            }

            if (messageDTOs.Count < 50)
            {
                messageDTOs.Add(endMsg);
            }

            return messageDTOs;
        }
    }
}
