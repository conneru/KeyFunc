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

        public void Add(TEntity entity)
		{
			_context.Set<TEntity>().Add(entity);
		}

        public void AddRange(IEnumerable<TEntity> entities)
		{
			_context.Set<TEntity>().AddRange(entities);
        }
        public async void Update(TEntity entity, TEntity updated)
		{
            var updatedEntity = _context.Set<TEntity>().Entry(updated);
			var originalEntity = _context.Set<TEntity>().Entry(entity);

            foreach (var property in updatedEntity.OriginalValues.Properties)
			{

				if (updatedEntity.Property(property.Name).CurrentValue != null && property.Name != "Id") {

					originalEntity.Property(property.Name).CurrentValue = updatedEntity.Property(property.Name).CurrentValue;
					originalEntity.Property(property.Name).IsModified = true;
				}

			}
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

