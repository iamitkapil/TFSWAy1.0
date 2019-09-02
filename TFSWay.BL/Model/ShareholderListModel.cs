using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
   public class ShareholderListModel
    {
        public int ShareholderId { get; set; }
        public int CompanyId { get; set; }
        public string ShareholderType { get; set; }
        public int? ShareholderPromoterId { get; set; }
        public string CompanyName { get; set; }
        public string PromoterName { get; set; }
        public string Name { get; set; }
        public string Share { get; set; }
        public string FaceValue { get; set; }
        public string Percentage { get; set; }
        public string IsMainShareholder { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
