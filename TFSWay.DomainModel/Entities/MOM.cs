using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class MOM
    {
        [Key]
        public int MOMId { get; set; }
        public int ProjectId { get; set; }
        public string MOMType { get; set; }
        public DateTime? MeetingDate { get; set; }
        public string Minutes { get; set; }
        public DateTime? TaskComplitionDate { get; set; }
        public string Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
