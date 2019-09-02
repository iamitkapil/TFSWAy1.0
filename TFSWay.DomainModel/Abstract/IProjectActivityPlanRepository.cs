using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IProjectActivityPlanRepository
    {

        IEnumerable<ProjectActivityPlan> ProjectActivityPlans { get; }
        IEnumerable<ProjectActivityPlan> GetProjectActivityPlans();
        Task<int> AddProjectActivityPlan(ProjectActivityPlan projectactivityplan);
        Task<int> UpdateProjectActivityPlan(ProjectActivityPlan projectactivityplan);
        Task<int> DeleteProjectActivityPlan(int projectactivityplanid);
 
    }
}