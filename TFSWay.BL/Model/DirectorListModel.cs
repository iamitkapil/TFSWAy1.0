using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class DirectorListModel
    {
        public int DirectorId { get; set; }
        public int CompanyId { get; set; }
        public string DirectorType { get; set;}
        public int? DirectorPromoterId { get; set; }
        public string CompanyName { get; set; }
        public string PromoterName { get; set; }
        public string Name { get; set;  }
        public string Address { get; set; }
        public string DIN { get; set; }
        public string PAN { get; set; }
        public string Qualification { get; set; }
        public string ExpRelSector { get; set; }
        public string CompSharehold { get; set; }
        public string IsMainDirector { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
