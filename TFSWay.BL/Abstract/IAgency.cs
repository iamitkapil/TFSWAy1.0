using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Abstract
{
    public interface IAgency
    {
        IEnumerable<Agency> GetAgencys(string agencytype);
        Agency GetAgency(int agencyid);
        Task<string> UpdateAgency(Agency agency);
        String DeleteAgency(int agencyid);
        Task<string> AddAgency(Agency agency);
    }
}
