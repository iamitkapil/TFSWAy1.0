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
    public   class LenderRepository:ILenderRepository
    {

        private TFSWayDBContext db;
        public LenderRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Lender> Lenders
        {
            get { return db.Lenders; }
        }


        public IEnumerable<Lender> GetLenders()
        {
            return this.Lenders;

        }

        public async Task<Lender> FetchbyLenderId(int lenderid)
        {
            Lender Lender = await db.Lenders.FindAsync(lenderid);
            return Lender;
        }

        public async Task<int> AddLender(Lender Lender)
        {
            db.Lenders.Add(Lender);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateLender(Lender Lender)
        {
            Lender existingLender = await FetchbyLenderId(Lender.LenderId);
            db.Entry(existingLender).State = EntityState.Detached;
            db.Entry(Lender).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteLender(int lenderid)
        {
            Lender Lender = await FetchbyLenderId(lenderid);
            db.Lenders.Remove(Lender);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
