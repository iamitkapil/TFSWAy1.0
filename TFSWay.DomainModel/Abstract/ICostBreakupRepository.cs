using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface ICostBreakupRepository
    {

        IEnumerable<CostBreakup> CostBreakups { get; }
        IEnumerable<CostBreakup> GetCostBreakups();
        Task<int> AddCostBreakup(CostBreakup costbreakup);
        Task<int> UpdateCostBreakup(CostBreakup costbreakup);
        Task<int> DeleteCostBreakup(int id);
    }
}
