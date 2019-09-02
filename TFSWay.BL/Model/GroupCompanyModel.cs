using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class GroupCompanyModel
    {
        public int GroupId { get; set; }
        public int CompanyId { get; set; }
        //public int ProjectId { get; set; }
        public string GroupName { get; set; }
        public string CompanyName { get; set; }
        public string RegisteredAddress { get; set; }
        //public string SiteAdress { get; set; }
        //public string ProjectName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
