using System;
using KeyFunc.DTO;
using KeyFunc.Models;

namespace KeyFunc.Repos
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByEmail(string email);

        Task<User?> GetUserDetails(int Id);

        Task<User?> GetUserByUsername(string username);
        Task<List<User>?> GetMatchingUsers(QueryDTO query);

    }
}
