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
   public class PromoterRepository : IPromoterRepository
    {
        private TFSWayDBContext db;
        public PromoterRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Promoter> Promoters
        {
            get { return db.Promoters; }
        }


        public IEnumerable<Promoter> GetPromoters()
        {
            return this.Promoters;

        }

        public async Task<Promoter> FetchbyPromoterId(int promoterid)
        {
            Promoter Promoter = await db.Promoters.FindAsync(promoterid);
            return Promoter;
        }

        public async Task<int> AddPromoter(Promoter Promoter)
        {
            db.Promoters.Add(Promoter);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdatePromoter(Promoter Promoter)
        {
            Promoter existingPromoter = await FetchbyPromoterId(Promoter.PromoterId);
            db.Entry(existingPromoter).State = EntityState.Detached;
            db.Entry(Promoter).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeletePromoter(int promoterid)
        {
            Promoter Promoter = await FetchbyPromoterId(promoterid);
            db.Promoters.Remove(Promoter);
            int result = await db.SaveChangesAsync();
            return result;
        }
    }
}
