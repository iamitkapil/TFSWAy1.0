using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class ActivityTemplate
    {
        [Key]
        public int ActivityID { get; set; }
        public string TemplateID { get; set; }
        public string Activity { get; set; }
        public int ParentID { get; set; }
        public string Dependency { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
