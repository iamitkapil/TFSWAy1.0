using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Abstract
{
    public interface IPromoter
    {
        
        IEnumerable<Promoter> GetPromoters(int companyid);
        IEnumerable<Promoter> GetPromotersLookupList();
        Promoter GetPromoter(int promoterid);
        Task<string> UpdatePromoter(Promoter client);
        String DeletePromoter(int promoterid);
        Task<string> AddPromoter(Promoter promoter);
    }
}
