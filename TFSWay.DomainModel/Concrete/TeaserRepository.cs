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
    public class TeaserRepository:ITeaserRepository
    {
        private TFSWayDBContext db;
        public TeaserRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Teaser> Teasers
        {
            get { return db.Teasers; }
        }


        public IEnumerable<Teaser> GetTeasers()
        {
            return this.Teasers;

        }

        public async Task<Teaser> FetchbyTeaserId(int teaserid)
        {
            Teaser Teaser = await db.Teasers.FindAsync(teaserid);
            return Teaser;
        }

        public async Task<int> AddTeaser(Teaser Teaser)
        {
            db.Teasers.Add(Teaser);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateTeaser(Teaser Teaser)
        {
            Teaser existingTeaser = await FetchbyTeaserId(Teaser.TeaserId);
            db.Entry(existingTeaser).State = EntityState.Detached;
            db.Entry(Teaser).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteTeaser(int teaserid)
        {
            Teaser Teaser = await FetchbyTeaserId(teaserid);
            db.Teasers.Remove(Teaser);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
