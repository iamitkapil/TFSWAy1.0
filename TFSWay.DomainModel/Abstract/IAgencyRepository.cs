using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
   public interface IAgencyRepository
    {
        IEnumerable<Agency> Agencys { get; }
        IEnumerable<Agency> GetAgencys();
        Task<int> AddAgency(Agency Agency);
        Task<int> UpdateAgency(Agency Agency);
        Task<int> DeleteAgency(int id);
    }
}
