using System;
using KeyFunc.DTO;
using KeyFunc.Models;

namespace KeyFunc.Repos
{
    public interface IMessageRepository : IRepository<Message>
    {
        Task<Message?> getDetailedMessage(int Id);
        Task<List<MessageDTO>?> getChatMessages(Message prevMsg);
    }
}
