using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class DocumentMaster
    {
        [Key]
        public int DocumentMasterId { get; set; }
        public string Stage { get; set; }
        public string Document { get; set; }

    }
}
