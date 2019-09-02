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
    public class CostBreakupRepository:ICostBreakupRepository
    {
        private TFSWayDBContext db;
        public CostBreakupRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<CostBreakup> CostBreakups
        {
            get { return db.CostBreakups; }
        }


        public IEnumerable<CostBreakup> GetCostBreakups()
        {
            return this.CostBreakups;

        }

        public async Task<CostBreakup> FetchbyCostBreakupId(int cbid)
        {
            CostBreakup CostBreakup = await db.CostBreakups.FindAsync(cbid);
            return CostBreakup;
        }

        public async Task<int> AddCostBreakup(CostBreakup CostBreakup)
        {
            db.CostBreakups.Add(CostBreakup);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateCostBreakup(CostBreakup CostBreakup)
        {
            CostBreakup existingCostBreakup = await FetchbyCostBreakupId(CostBreakup.CBID);
            db.Entry(existingCostBreakup).State = EntityState.Detached;
            db.Entry(CostBreakup).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteCostBreakup(int cbid)
        {
            CostBreakup CostBreakup = await FetchbyCostBreakupId(cbid);
            db.CostBreakups.Remove(CostBreakup);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
