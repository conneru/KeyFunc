using System;
using KeyFunc.Data;
using KeyFunc.DTO;
using KeyFunc.Models;
using Microsoft.EntityFrameworkCore;

namespace KeyFunc.Repos
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        KeyFuncContext _context;

        public UserRepository(KeyFuncContext context)
            : base(context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            User? user = await _context.Users.Where(u => u.Email == email).Include(u=>u.Followers).Include(u=>u.Following).SingleAsync();

            List<Chat>? chats = await _context
                .Chats.Where(c => c.Users.Contains(user))
                .Include(c => c.Users)
                .OrderByDescending(c => c.Messages.Max(m => m.CreatedAt))
                .ToListAsync();

            user.Chats = chats;



            foreach (Chat c in chats)
            {
                List<Message>? messages = await _context
                    .Messages.Where(m => m.ChatId == c.Id)
                    .Include(m => m.User)
                    .Include(m => m.UsersWhoHaveRead)
                    .OrderByDescending(m => m.CreatedAt)
                    .Take(1)
                    .ToListAsync();

                c.Messages = messages;
            }
            return user;
        }

        public async Task<User?> GetUserDetails(int Id)
        {
            User? foundUser = await _context
                .Users.Where(u => u.Id == Id)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .Include(u => u.Posts)
                .SingleAsync();

            return foundUser;
        }


        public async Task<User?> GetUserByUsername(string username)
        {
            User? foundUser = await _context
                .Users.Where(u => u.Username == username)
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .SingleAsync();
            
            foundUser.Posts = await _context.Posts.Where(p => p.UserId == foundUser.Id).Include(p=>p.Comments).Include(p => p.Images).ThenInclude(i=>i.Tags).OrderByDescending(p => p.createdAt).ToListAsync();

            return foundUser;
        }


        public async Task<List<User>?> GetMatchingUsers(QueryDTO query)
        {

            List<User?> users = await _context.Users.Where(u=> u.Username.Contains(query.Query)).Include(u=>u.Followers).OrderBy(u => !u.Username.ToLower().StartsWith(query.Query.ToLower())).ThenByDescending(u => u.Followers.Any(f=> f.Id == query.UserId))
            .ThenBy(u => u.Username).ToListAsync();

            return users;

        }
    }
}
