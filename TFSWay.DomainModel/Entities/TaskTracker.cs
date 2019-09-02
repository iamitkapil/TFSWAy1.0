using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
   public class TaskTracker
    {
        [Key]
        public int TaskTrackerID { get; set; }
        public int ProjectID { get; set; }
        public string Task { get; set; }
        public string Responsible { get; set; }
        public string ResponsibleEmail { get; set; }
        public DateTime? PlanDate { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
