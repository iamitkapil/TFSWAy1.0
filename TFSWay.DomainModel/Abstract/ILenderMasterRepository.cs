using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;


namespace TFSWay.DomainModel.Abstract
{
    public interface ILenderMasterRepository
    {
        IEnumerable<LenderMaster> MasterLenders { get; }
        IEnumerable<LenderMaster> GetMasterLenders();
        Task<int> AddLenderMaster(LenderMaster lender);
        Task<int> UpdateLenderMaster(LenderMaster lender);
        Task<int> DeleteLenderMaster(int id);
    }
}
