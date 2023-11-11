using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using KeyFunc.Data;
namespace KeyFunc.Repos
{
	public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
		DbContext _context;

		public Repository(DbContext context)
		{
			_context = context;
		}


		public async Task<TEntity?> GetById(int Id)
		{
			TEntity? entity = await _context.Set<TEntity>().FindAsync(Id);

			return entity;
		}

        public void Add(TEntity entity)
		{
			_context.Set<TEntity>().Add(entity);
		}

        public void AddRange(IEnumerable<TEntity> entities)
		{
			_context.Set<TEntity>().AddRange(entities);
		}

		public void Update(TEntity entity)
		{
			_context.Set<TEntity>().Update(entity);
		}

        public void Delete(TEntity entity)
		{
			_context.Set<TEntity>().Remove(entity);
		}

        public void DeleteRange(IEnumerable<TEntity> entities)
		{
			_context.Set<TEntity>().RemoveRange(entities);
		}


        public void Save()
		{
			_context.SaveChanges();
		}


	}
}

