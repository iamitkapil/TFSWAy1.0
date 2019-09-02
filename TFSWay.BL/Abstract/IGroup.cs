using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IGroup
    {
        IEnumerable<GroupCompanyModel> GetGCList();
        IEnumerable<Group> GetGroups();
        IEnumerable<Company> GetCompanys();
        GroupCompanyModel GetGC(int companyid);
        Task<string> UpdateGC(GroupCompanyModel gcpmodel);
        String DeleteGC(GroupCompanyModel gcpmodel);
        Task<string> AddGC(GroupCompanyModel gcpmodel);
    }
}
