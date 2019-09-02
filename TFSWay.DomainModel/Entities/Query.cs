using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
   public class Query
    {
        [Key]
        public int QueryId { get; set; }
        public int ProjectID { get; set; }
        public string Subject { get; set; }
        public string AssignTo { get; set; }
        public string AssignToMailID { get; set; }
        public string Querytype { get; set; }
        public string Severity { get; set; }
        public string Status { get; set; }
        public string RefDocument { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
