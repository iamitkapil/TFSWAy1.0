using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Lender
    {
        [Key]
        public int LenderId { get; set; }
        public int ClientId { get; set; }
        public int ProjectId { get; set; }
        public int LenderMasterId { get; set; }
        //public string LenderName { get; set; }
        //public string LenderAddress { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
