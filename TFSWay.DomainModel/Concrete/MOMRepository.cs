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
    public class MOMRepository : IMOMRepository
    {

        private TFSWayDBContext db;
        public MOMRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<MOM> MOMs
        {
            get { return db.MOMs; }
        }

        public IEnumerable<MOM> GetMOMs()
        {
            return this.MOMs;

        }

        public async Task<MOM> FetchbyMOMId(int momid)
        {
            MOM mom = await db.MOMs.FindAsync(momid);
            return mom;
        }

        public async Task<int> AddMOM(MOM mom)
        {
            db.MOMs.Add(mom);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteMOM(int momid)
        {
            MOM mom = await FetchbyMOMId(momid);
            db.MOMs.Remove(mom);
            int result = await db.SaveChangesAsync();
            return result;
        }
        public async Task<int> UpdateMOM(MOM mom)
        {
            MOM existingMOM = await FetchbyMOMId(mom.MOMId);
            db.Entry(existingMOM).State = EntityState.Detached;
            db.Entry(existingMOM).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}

