using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using KeyFunc.Data;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using KeyFunc.Models;

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

		public async Task<IEnumerable<TEntity?>> GetAll()
		{
			List < TEntity > entities= await _context.Set<TEntity>().ToListAsync();

			return entities.ToArray();
		}

        public TEntity Add(TEntity entity)
		{
			_context.Set<TEntity>().Add(entity);

			return entity;
		}

        public void AddRange(IEnumerable<TEntity> entities)
		{
			_context.Set<TEntity>().AddRange(entities);
        }

        public async Task<TEntity> Update(int id, TEntity entity)
		{

			var findOriginal = await _context.Set<TEntity>().FindAsync(id);
			var originalEntity = _context.Set<TEntity>().Entry(findOriginal);
            var updatedEntity = _context.Set<TEntity>().Entry(entity);

			foreach (var property in updatedEntity.OriginalValues.Properties)
			{

				if (updatedEntity.Property(property.Name).CurrentValue != null && property.Name != "Id")
				{
					Console.WriteLine(property.Name);
					originalEntity.Property(property.Name).CurrentValue = updatedEntity.Property(property.Name).CurrentValue;
					originalEntity.Property(property.Name).IsModified = true;
				}

			}

			return entity;
		}

        public void Delete(TEntity entity)
		{
			_context.Set<TEntity>().Remove(entity);
		}

        public void DeleteRange(IEnumerable<TEntity> entities)
		{
			_context.Set<TEntity>().RemoveRange(entities);
		}


        public async Task<int> Save()
		{
			await _context.SaveChangesAsync();

			return 200;
		}


	}
}

