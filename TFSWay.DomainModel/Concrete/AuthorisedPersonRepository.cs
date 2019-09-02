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
    public class AuthorisedPersonRepository:IAuthorisedPersonRepository
    {

        private TFSWayDBContext db;
        public AuthorisedPersonRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<AuthorisedPerson> AuthorisedPersons
        {
            get { return db.AuthorisedPersons; }
        }


        public IEnumerable<AuthorisedPerson> GetAuthorisedPersons()
        {
            return this.AuthorisedPersons;

        }

        public async Task<AuthorisedPerson> FetchbyAuthorisedPersonId(int authorisedpersonid)
        {
            AuthorisedPerson AuthorisedPerson = await db.AuthorisedPersons.FindAsync(authorisedpersonid);
            return AuthorisedPerson;
        }

        public async Task<int> AddAuthorisedPerson(AuthorisedPerson AuthorisedPerson)
        {
            db.AuthorisedPersons.Add(AuthorisedPerson);
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> UpdateAuthorisedPerson(AuthorisedPerson AuthorisedPerson)
        {
            AuthorisedPerson existingAuthorisedPerson = await FetchbyAuthorisedPersonId(AuthorisedPerson.AuthorisedPersonId);
            db.Entry(existingAuthorisedPerson).State = EntityState.Detached;
            db.Entry(AuthorisedPerson).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteAuthorisedPerson(int authorisedpersonid)
        {
            AuthorisedPerson AuthorisedPerson = await FetchbyAuthorisedPersonId(authorisedpersonid);
            db.AuthorisedPersons.Remove(AuthorisedPerson);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
