using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Document
    {
        [Key]
        public int DocumentID { get; set; }
        public int ProjectID { get; set; }
        public int GroupID { get; set; }
        public string DocumentName { get; set; }
        public string FilePath { get; set; }
        public string DocumnetType { get; set; }
        public string Stage { get; set; }
        public string IsAvailable { get; set; }
        public string Completed { get; set; }
        public string IsMaster { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
    }
}
