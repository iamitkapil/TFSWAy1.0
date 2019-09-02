using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;

namespace TFSWay.BL.Concrete
{
    public class clsCostBreakup : ICostBreakup
    {
        private ICostBreakupRepository CostBreakupRepository;
        private IProjectRepository ProjectRepository;

        public clsCostBreakup(ICostBreakupRepository costbreakupRepository,IProjectRepository projectRepository)
        {
            this.CostBreakupRepository = costbreakupRepository;
            this.ProjectRepository = projectRepository;
        }


        public IEnumerable<CostBreakup> GetCostBreakups()
        {
            var costbreakupList = CostBreakupRepository.GetCostBreakups();
            return costbreakupList;
        }

        public CostBreakup GetCostBreakupbyProjectId(int projectId)
        {
            CostBreakup costbreakup = CostBreakupRepository.GetCostBreakups().SingleOrDefault(p => p.ProjectID == projectId);
            return costbreakup;

        }

        public async Task<string> UpdateCostBreakup(CostBreakup costBreakup)
        {

            decimal totalcost = 0;
            CostBreakup existingcostBreakup = CostBreakupRepository.GetCostBreakups().SingleOrDefault(c => c.CBID == costBreakup.CBID);

            if (existingcostBreakup == default(CostBreakup))
                return "CostBreakup doesn't exist";


            Project existingproject = ProjectRepository.Projects.SingleOrDefault(p => p.ProjectId == costBreakup.ProjectID);
                   
            
             totalcost =  costBreakup.LandSiteCost.GetValueOrDefault() + costBreakup.SolarModules.GetValueOrDefault() + 
                costBreakup.ModuleMountStruct.GetValueOrDefault() + 
                costBreakup.PowerCondUnit.GetValueOrDefault() + costBreakup.EvacuationCost.GetValueOrDefault() +
                costBreakup.Preoperativeexp.GetValueOrDefault() + 
                costBreakup.Contingency.GetValueOrDefault() + costBreakup.IDC.GetValueOrDefault() 
                + costBreakup.FinancingCost.GetValueOrDefault()
                + costBreakup.Workingcapital.GetValueOrDefault()
                + costBreakup.Dsra.GetValueOrDefault();

            costBreakup.TotalCost = totalcost;
            existingproject.TotalCost = totalcost;

            int updatecostBreakup = await CostBreakupRepository.UpdateCostBreakup(costBreakup);

            int updateproject = await ProjectRepository.UpdateProject(existingproject); 

            return updatecostBreakup > 0 ? "Successfully updated CostBreakup" : "Updation failed";

        }
    }
}
