using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;
using System.Linq.Expressions;


namespace TFSWay.DomainModel.Concrete
{
    public class GenericRepository<TEntity> where TEntity :class
    {
        internal TFSWayDBContext contextdb;
        internal DbSet<TEntity> dbSet;

        public GenericRepository(TFSWayDBContext context)
        {
            this.contextdb = context;
            this.dbSet = context.Set<TEntity>();
        }

        public async virtual Task<TEntity> GetByID(object id)
        {
            TEntity obj = await dbSet.FindAsync(id);
            return obj;
        }

        public async virtual Task<int> Insert(TEntity entity)
        {
            dbSet.Add(entity);
            int result = await contextdb.SaveChangesAsync();
            return result;
        }

        public virtual void Delete(object id)
        {
            TEntity entityToDelete = dbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (contextdb.Entry(entityToDelete).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDelete);
            }
            dbSet.Remove(entityToDelete);
        }

        public async virtual Task<int> Update(TEntity entityToUpdate, object id)
        {
            TEntity existingEntity = dbSet.Find(id);
            contextdb.Entry(existingEntity).State = EntityState.Detached;
            contextdb.Entry(entityToUpdate).State = EntityState.Modified;
            int result = await contextdb.SaveChangesAsync();
            return result;
        }


        public async Task<IEnumerable<TEntity>> GetRecords()
        {
            IEnumerable<TEntity> results = await dbSet.ToListAsync();
            return results;
        }
    }
}
