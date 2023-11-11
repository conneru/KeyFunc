using System;
using System.Linq.Expressions;
namespace KeyFunc.Repos
{
	public interface IRepository<TEntity> where TEntity : class
    {
		Task<TEntity?> GetById(int Id);
		Task<IEnumerable<TEntity?>> GetAll();


        void Add(TEntity entity);
		void AddRange(IEnumerable<TEntity> entities);

		void Update(TEntity entity);

        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);

		void Save();

	}
}

