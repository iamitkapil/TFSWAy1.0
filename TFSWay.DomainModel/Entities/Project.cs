using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace TFSWay.DomainModel.Entities
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }
        public int CompanyId { get; set; }
        public int GroupId { get; set; }
        public int? SupervisorId { get; set; }
        public int? ProjectManagerId { get; set; }
        public string ProjectName { get; set; }
        public DateTime? ProjectStartDate { get; set; }
        public DateTime? ProjectEndDate { get; set; }
        public string Status { get; set; }
        public string CurrentStage { get; set; }
        public string Reason { get; set; }
        public string CINNumber { get; set; }
        public string SiteAddress { get; set; }
        public string PAN { get; set; }
        public DateTime? IncorporationDate { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string PlantLocation { get; set; }
        public string Planttype { get; set; }
        public string Technology { get; set; }
        public string Substation { get; set; }
        public string ProjectSize { get; set; }
        public int? Capacity_AC { get; set; }
        public string ProjectCapacityUnit { get; set; }
        public int? Capacity_DC { get; set; }
        public string ProjectTariffUnit { get; set; }
        public decimal? TotalCost { get; set; }
        public decimal? CostperMW_AC { get; set; }
        public decimal? CostperMW_DC { get; set; }
        public decimal? TotalDebt { get; set; }
        public decimal? TotalEquity { get; set; }
        public string DebtEquityRatio { get; set; }
        public decimal? MinDSCR { get; set; }
        public decimal? AvgDSCR { get; set; }
        public decimal? IRR { get; set; }
        public decimal? CUF { get; set; }
        public DateTime? SCOD { get; set; }
        public decimal? Tariff { get; set; }
        public DateTime? PPADate { get; set; }
        public decimal? VGF { get; set; }
        public string Discom { get; set; }
        public string CreditCompRating { get; set; }
        public string CreditPromRating { get; set; }
        public string TFSShadowRating { get; set; }
        public string DTDTenure { get; set; }
        public string RepaymentPeriod { get; set; }
        public DateTime? PreliminaryScrDate { get; set; }
        public decimal? RequiredLand { get; set; }
        public string EmloyeeID { get; set; }
        public string OMContractor { get; set; }
        public string EPCContractor { get; set; }
        public string TRABanker { get; set; }
        public string SanctionLetterNo { get; set; }
        public DateTime? SanctionLetterDate { get; set; }
        public DateTime? RTLdate { get; set; }
        public DateTime? DeedofHypotheciationDate { get; set; }
        public DateTime? DeedofpledgeDate { get; set; }
        public DateTime? IomDate { get; set; }
        public DateTime? ChargepledgeDate { get; set; }
        public DateTime? ChargeHypotheciationDate { get; set; }
        public DateTime? ChargeiomDate { get; set; }
        public DateTime? MortgageDate { get; set; }
        public DateTime? ChargemortgageDate { get; set; }
        public DateTime? LoaDate { get; set; }
        public string RegisteredAddress { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }


    }
}
