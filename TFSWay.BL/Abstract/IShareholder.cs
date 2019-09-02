using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;


namespace TFSWay.BL.Abstract
{
    public interface IShareholder
    {
        IEnumerable<ShareholderListModel> GetAllShareholders(int companyid);
        IEnumerable<ShareholderListModel> GetShareholdersLookupList();
        Task<string> AddShareholder(Shareholder shareholder);
        Shareholder GetShareholder(int shareholderid);
        Task<string> UpdateShareholder(Shareholder shareholder);
        String DeleteShareholder(int shareholderid);
    }

    public enum ShareholderType { Company, Promoter, Others };
}
