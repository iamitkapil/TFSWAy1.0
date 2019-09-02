using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class ProjectActivityPlanModel
    {
        public int ProjectActivityPlanID { get; set; }
        public int ProjectPlanID { get; set; }
        public int ProjectID { get; set; }
        public int ActivityID { get; set; }
        public string ParentID { get; set; }
        public string SrNo { get; set; }
        public string Task { get; set; }
        public string Activity { get; set; }
        public string Dependency { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Delay { get; set; }
        public DateTime? ComplitionDate { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
