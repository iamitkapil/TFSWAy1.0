using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IProjectPlanRepository
    {

        IEnumerable<ProjectPlan> ProjectPlans { get; }
        IEnumerable<ProjectPlan> GetProjectPlans();
        Task<int> AddProjectPlan(ProjectPlan projectplan);
        Task<int> UpdateProjectPlan(ProjectPlan projectplan);
        Task<int> DeleteProjectPlan(int projectplanid);
 
    }
}