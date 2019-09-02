using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
  public  class StrategyProposal
    {
        [Key]
        public int StrategyProposalId { get; set; }
        public int ProjectId { get; set; }
        public string PpaTerminationClause { get; set; }
        public string PpaLiquidatedDamages { get; set; }
        public string PpaPaymentmechanism { get; set; }
        public string PpaOthers { get; set; }
        public string ExperienceinRelSec { get; set; }
        public string FinancialStrenth { get; set; }
        public string IndicativeEquityArrangement { get; set; }
        public string PrevRelationwithLender { get; set; }
        public string Tenure { get; set; }
        public string ROI { get; set; }
        public string TermsAndConditions { get; set; }
        public string PowerFinCorp { get; set; }
        public string RuralElectrificationCorp { get; set; }
        public string PolicyCompOthers { get; set; }
        public string StrategyAdopted { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

    }
}
