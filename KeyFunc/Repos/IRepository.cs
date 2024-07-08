using System;
using System.Linq.Expressions;

namespace KeyFunc.Repos
{
    public interface IRepository<TEntity>
        where TEntity : class
    {
        Task<TEntity?> GetById(int Id);
        Task<IEnumerable<TEntity?>> GetAll();

        TEntity Add(TEntity entity);
        void AddRange(IEnumerable<TEntity> entities);

        Task<TEntity> Update(int id, TEntity entity);

        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);

        Task<int> Save();
    }
}
