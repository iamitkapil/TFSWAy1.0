using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface ICompanyRepository
    {
        IEnumerable<Company> Companys { get; }
        IEnumerable<Company> GetCompanys();
        Task<int> AddCompany(Company Company);
        Task<int> UpdateCompany(Company Company);
        Task<int> DeleteCompany(int id);
    }
}
