using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TFSWay.BL.Model
{
    public class DocumentLenderModel
    {
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
        public string LenderName { get; set; }
        public string LenderAddress { get; set; }
    }
}
