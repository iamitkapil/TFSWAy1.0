using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
   public class CostBreakup
    {
        [Key]
        public int  CBID{ get; set; }
        public int ProjectID{ get; set; }
        public decimal?  LandSiteCost{ get; set; }
        public decimal?  SolarModules{ get; set; }
        public decimal?  Dsra{ get; set; }
        public decimal?  ModuleMountStruct{ get; set; }
        public decimal?  PowerCondUnit{ get; set; }
        public decimal?  EvacuationCost{ get; set; }
        public decimal?  Transmissionsys{ get; set; }
        public decimal?  Preoperativeexp{ get; set; }
        public decimal?  Contingency{ get; set; }
        public decimal?  IDC{ get; set; }
        public decimal? FinancingCost { get; set; }
        public decimal? Workingcapital { get; set; }
        public decimal? TotalCost { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
