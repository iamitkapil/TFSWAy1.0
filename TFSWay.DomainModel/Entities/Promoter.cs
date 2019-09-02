using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
  public  class Promoter
    {
        [Key]
        public int PromoterId { get; set; }
        public int CompanyId { get; set; }
        public int ProjectId { get; set; }
        public string  Name{ get; set; }
        public string  ChangedName{ get; set; }
        public DateTime? ChangedNameDate { get; set; }
        public string  CIN{ get; set; }
        public string  OfficeAddress{ get; set; }
        public string  PAN{ get; set; }
        public DateTime? IncorporationDate { get; set; }
        public string IsMainPromoter { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
