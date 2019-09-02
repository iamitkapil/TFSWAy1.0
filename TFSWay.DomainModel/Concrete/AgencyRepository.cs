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
    public class AgencyRepository:IAgencyRepository
    {
        private TFSWayDBContext db;
        public AgencyRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Agency> Agencys
        {
            get { return db.Agencys; }
        }


        public IEnumerable<Agency> GetAgencys()
        {
            return this.Agencys;

        }

        public async Task<Agency> FetchbyAgencyId(int agencyid)
        {
            Agency Agency = await db.Agencys.FindAsync(agencyid);
            return Agency;
        }

        public async Task<int> AddAgency(Agency agency)
        {
            db.Agencys.Add(agency);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateAgency(Agency agency)
        {
            Agency existingAgency = await FetchbyAgencyId(agency.AgencyId);
            db.Entry(existingAgency).State = EntityState.Detached;
            db.Entry(agency).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteAgency(int agencyid)
        {
            Agency Agency = await FetchbyAgencyId(agencyid);
            db.Agencys.Remove(Agency);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
