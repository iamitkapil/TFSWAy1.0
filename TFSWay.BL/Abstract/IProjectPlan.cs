using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IProjectPlan
    {
        IEnumerable<ProjectPlan> GetProjectPlans();
        IEnumerable<ProjectPlan> GetProjectPlans(int projectid);
        Task<String> AddProjectPlan(ProjectPlan projectplan);
        Task<String> UpdateProjectPlan(ProjectPlan projectplan);
        String DeleteProjectPlan(int projectplanid);
    }

}
