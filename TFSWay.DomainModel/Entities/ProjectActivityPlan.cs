using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class ProjectActivityPlan
    {
        [Key]
        public int ProjectActivityPlanID { get; set; }
        public int ProjectPlanID { get; set; }
        public int ProjectID { get; set; }
        public string TemplateID { get; set; }
        public string ParentID { get; set; }
        public string SrNo { get; set; }
        public string Activity { get; set; }
        public string Task { get; set; }
        public string Dependency { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? ComplitionDate { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}

