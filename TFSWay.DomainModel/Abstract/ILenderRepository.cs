using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface ILenderRepository
    {
        IEnumerable<Lender> Lenders { get; }
        IEnumerable<Lender> GetLenders();
        Task<int> AddLender(Lender lender);
        Task<int> UpdateLender(Lender lender);
        Task<int> DeleteLender(int id);
    }
}
