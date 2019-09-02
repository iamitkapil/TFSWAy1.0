using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class ProjectPlan
    {
        [Key]
        public int ProjectPlanID { get; set; }
        public int ProjectID { get; set; }
        public string ProjectPlanStatus { get; set; }
        public string ReopenReason { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}

