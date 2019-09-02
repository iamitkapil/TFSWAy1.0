using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
   public class QueryRefDocument
    {
        [Key]

        public int QueryRefDocumentID { get; set; }
        public int QueryId { get; set; }
        public string DocumnetPath { get; set; }
        public string DocumnetName { get; set; }
 
    }
}
