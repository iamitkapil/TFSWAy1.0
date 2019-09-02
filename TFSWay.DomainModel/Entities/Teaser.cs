using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Teaser
    {
        [Key]
        public int TeaserId { get; set; }
        public string Group { get; set; }
        public int PromoterId { get; set; }
        public int ProjectId { get; set; }
        public string PromoterDescription { get; set; }
        public string ExpectedROI { get; set; }
        public string SellingArrangement { get; set; }
        public string PowerEvacuation { get; set; }
        public string ProposedSecurity { get; set; }
        public string Request { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
