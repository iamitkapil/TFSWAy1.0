using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;


namespace TFSWay.DomainModel.Entities
{
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }
        public int GroupId { get; set; }
        public string CompanyName { get; set; }
        public string RegisteredAddress { get; set; }
        //public string SiteAdress { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }
}
