using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
    public class DirectorRepository:IDirectorRepository
    {
        private TFSWayDBContext db;
        public DirectorRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Director> Directors
        {
            get { return db.Directors; }
        }


        public IEnumerable<Director> GetDirectors()
        {
            return this.Directors;

        }

        public async Task<Director> FetchbyDirectorId(int directorid)
        {
            Director Director = await db.Directors.FindAsync(directorid);
            return Director;
        }

        public async Task<int> AddDirector(Director Director)
        {
            db.Directors.Add(Director);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateDirector(Director Director)
        {
            Director existingDirector = await FetchbyDirectorId(Director.DirectorId);
            db.Entry(existingDirector).State = EntityState.Detached;
            db.Entry(Director).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteDirector(int directorid)
        {
            Director Director = await FetchbyDirectorId(directorid);
            db.Directors.Remove(Director);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
