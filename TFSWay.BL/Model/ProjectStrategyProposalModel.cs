using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;

namespace TFSWay.BL.Model
{
    public class ProjectStrategyProposalModel
    {
        public ProjectStrategyProposalModel(Project project, StrategyProposal strategyproposal,Group group)
        {
            ProjectId = project.ProjectId;
            ProjectGroup = group.GroupName;
            ProjectName = project.ProjectName;
            ProjectLocation = project.PlantLocation;
            ProjectCapacityAC = project.Capacity_AC;
            ProjectCapacityDC = project.Capacity_DC;
            ProjectTotalCost = project.TotalCost;
            ProjectEquity = project.TotalEquity;
            ProjectDebt = project.TotalDebt;
            ProjectCreditRating = project.CreditCompRating;
            ProjectIRR = project.IRR;
            ProjectMinDSCR = project.MinDSCR;
            ProjectAvgDSCR = project.AvgDSCR;
            ProjectDiscom = project.Discom;
            ProjectTarrif = project.Tariff;
            ProjectSCOD = project.SCOD;
            strategyProposal = strategyproposal;

        }


        public int ProjectId { get; set; }
        public string ProjectGroup { get; set; }
        public string ProjectName { get; set; }
        public decimal? ProjectCapacityAC { get; set; }
        public decimal? ProjectCapacityDC { get; set; }
        public string ProjectLocation { get; set; }
        public decimal? ProjectTotalCost { get; set; }
        public decimal? ProjectEquity { get; set; }
        public decimal? ProjectDebt { get; set; }
        public string ProjectCreditRating { get; set; }
        public decimal? ProjectIRR { get; set; }
        public decimal? ProjectMinDSCR { get; set; }
        public decimal? ProjectAvgDSCR { get; set; }
        public string ProjectDiscom { get; set; }
        public decimal? ProjectTarrif { get; set; }
        public DateTime? ProjectSCOD { get; set; }
        public StrategyProposal strategyProposal;


    }
}
