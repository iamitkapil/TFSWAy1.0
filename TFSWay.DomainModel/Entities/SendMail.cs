using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Mail
    {
        [Key]
        public int MailID { get; set; }
        public string Stage { get; set; }
        public string Body { get; set; }
        public string Subject { get; set; }
        public string KeyWord { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
