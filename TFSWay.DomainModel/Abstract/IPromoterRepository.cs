using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IPromoterRepository
    {

        IEnumerable<Promoter> Promoters { get; }
        IEnumerable<Promoter> GetPromoters();
        Task<int> AddPromoter(Promoter promoter);
        Task<int> UpdatePromoter(Promoter promoter);
        Task<int> DeletePromoter(int id);
    }
}
