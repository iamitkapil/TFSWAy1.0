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
    public class CompanyRepository : ICompanyRepository
    {
        private TFSWayDBContext db;
        public CompanyRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Company> Companys
        {
            get { return db.Companys; }
        }


        public IEnumerable<Company> GetCompanys()
        {
            return this.Companys;

        }

        public async Task<Company> FetchbyCompanyId(int companyid)
        {
            Company Company = await db.Companys.FindAsync(companyid);
            return Company;
        }

        public async Task<int> AddCompany(Company company)
        {
            db.Companys.Add(company);
            await db.SaveChangesAsync();
            int insertedcompanyid = company.CompanyId;
            return insertedcompanyid;
        }

        public async Task<int> UpdateCompany(Company company)
        {
            Company existingCompany = await FetchbyCompanyId(company.CompanyId);
            db.Entry(existingCompany).State = EntityState.Detached;
            db.Entry(company).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteCompany(int companyid)
        {
            Company Company = await FetchbyCompanyId(companyid);
            db.Companys.Remove(Company);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
