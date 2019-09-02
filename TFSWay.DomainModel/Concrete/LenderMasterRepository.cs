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
    public class LenderMasterRepository:ILenderMasterRepository
    {
        private TFSWayDBContext db;
        public LenderMasterRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<LenderMaster> MasterLenders
        {
            get { return db.MasterLenders; }
        }


        public IEnumerable<LenderMaster> GetMasterLenders()
        {
            return this.MasterLenders;

        }

        public async Task<LenderMaster> FetchbyLenderMasterId(int lendermasterid)
        {
            LenderMaster LenderMaster = await db.MasterLenders.FindAsync(lendermasterid);
            return LenderMaster;
        }

        public async Task<int> AddLenderMaster(LenderMaster Lendermaster)
        {
            db.MasterLenders.Add(Lendermaster);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateLenderMaster(LenderMaster lendermaster)
        {
            LenderMaster existingLenderMaster = await FetchbyLenderMasterId(lendermaster.LenderMasterId);
            db.Entry(existingLenderMaster).State = EntityState.Detached;
            db.Entry(lendermaster).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteLenderMaster(int lendermasterid)
        {
            LenderMaster lendermaster = await FetchbyLenderMasterId(lendermasterid);
            db.MasterLenders.Remove(lendermaster);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
