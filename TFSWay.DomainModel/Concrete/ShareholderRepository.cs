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
    public class ShareholderRepository:IShareholderRepository
    {

        private TFSWayDBContext db;
        public ShareholderRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Shareholder> Shareholders
        {
            get { return db.Shareholders; }
        }


        public IEnumerable<Shareholder> GetShareholders()
        {
            return this.Shareholders;

        }

        public async Task<Shareholder> FetchbyShareholderId(int shareholderid)
        {
            Shareholder Shareholder = await db.Shareholders.FindAsync(shareholderid);
            return Shareholder;
        }

        public async Task<int> AddShareholder(Shareholder Shareholder)
        {
            db.Shareholders.Add(Shareholder);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateShareholder(Shareholder Shareholder)
        {
            Shareholder existingShareholder = await FetchbyShareholderId(Shareholder.ShareholderId);
            db.Entry(existingShareholder).State = EntityState.Detached;
            db.Entry(Shareholder).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteShareholder(int shareholderid)
        {
            Shareholder Shareholder = await FetchbyShareholderId(shareholderid);
            db.Shareholders.Remove(Shareholder);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
