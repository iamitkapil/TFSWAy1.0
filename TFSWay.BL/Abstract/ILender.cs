using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;


namespace TFSWay.BL.Abstract
{
    public interface ILender
    {
        IEnumerable<LenderModel> GetLenders(int Id);
        IEnumerable<LenderModel> GetMasterLenders();
        Task<string> AddLender(LenderModel lender);
        Task<string> UpdateLender (LenderModel lender);
        IEnumerable<LenderModel> GetLendersbyProjectID(int Id);

    }
}
