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
    public class ClientDetailRepository : IClientDetailRepository
    {

        private TFSWayDBContext db;
        public ClientDetailRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<ClientDetail> ClientDetails
        {
            get { return db.ClientDetails; }
        }


        public IEnumerable<ClientDetail> GetClientDetails()
        {
            return this.ClientDetails;

        }

        public async Task<ClientDetail> FetchbyClientId(int clientid)
        {
            ClientDetail clientdetail = await db.ClientDetails.FindAsync(clientid);
            return clientdetail;
        }

        public async Task<int> AddClientDetail(ClientDetail clientdetail)
        {
            db.ClientDetails.Add(clientdetail);
            int result = await db.SaveChangesAsync();
            return result;          
        }

        public async Task<int> UpdateClientDetail(ClientDetail clientdetail)
        {
            ClientDetail existingclientdetail = await FetchbyClientId(clientdetail.ClientID);
            db.Entry(existingclientdetail).State = EntityState.Detached;
            db.Entry(clientdetail).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteClientDetail(int clientid)
        {
            ClientDetail clientdetail = await FetchbyClientId(clientid);
            db.ClientDetails.Remove(clientdetail);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

