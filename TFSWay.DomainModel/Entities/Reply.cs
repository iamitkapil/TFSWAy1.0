using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Reply
    {
        [Key]
        public int ReplyId { get; set; }
        public int QueryId { get; set; }
        public string QueryText { get; set; }
        public DateTime? QueryDate { get; set; }
        public string ReplyText { get; set; }
        public DateTime? ReplyDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
