using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Abstract
{
   public interface ICostBreakup
    {

        IEnumerable<CostBreakup> GetCostBreakups();
        CostBreakup GetCostBreakupbyProjectId(int projectId);
        Task<string> UpdateCostBreakup(CostBreakup client);
    }
}
