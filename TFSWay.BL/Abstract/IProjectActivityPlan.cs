using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IProjectActivityPlan
    {
        IEnumerable<ProjectActivityPlan> GetProjectActivityPlans();
        IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlansbyID(int projectid);
        IEnumerable<ActivityTemplate> GetStagesbyID(int projectid);
        IEnumerable<ActivityModel> GetActivitiesbyID(int projectid, int templateid);
        IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlans(int projectId);
        Task<int> AddProjectActivityPlan(ProjectActivityPlan projectactivityplan);
        Task<int> AddProjectTaskPlan(ProjectActivityPlan projectactivityplan);
        bool IsActivitiesExist(int projectid, string activityid);
        int ValidateActivity(int projectid, int activityid);
        string GetDependentDate(int activityid,int projectplanid, string type);
        bool IsTaskExist(int projectid, string task);
        Task<String> UpdateProjectActivityPlan(ProjectActivityPlan projectactivityplan);
        String DeleteProjectActivityPlan(int projectactivityplanid);
        ProjectPlanStausGraphModel GetProjectBarGraphData(int projectid);
    }

}
