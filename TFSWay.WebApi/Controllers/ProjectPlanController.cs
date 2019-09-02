using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;
using System.Threading.Tasks;

namespace TFSWay.WebApi.Controllers
{
    public class ProjectPlanController : ApiController
    {
        private IProjectPlan _ProjectPlan;
        private IProjectActivityPlan _ProjectActivityPlan;

        public ProjectPlanController(IProjectPlan ProjectPlan, IProjectActivityPlan ProjectActivityPlan)
        {
            _ProjectPlan = ProjectPlan;
            _ProjectActivityPlan = ProjectActivityPlan;
        }


        [HttpGet]
        public IEnumerable<ProjectPlan> GetProjectPlans()
        {
            var ProjectPlan = _ProjectPlan.GetProjectPlans();
            return ProjectPlan;
        }

        [HttpGet]
        public IEnumerable<ProjectActivityPlan> GetProjectActivityPlans()
        {
            var ProjectActivityPlan = _ProjectActivityPlan.GetProjectActivityPlans();
            return ProjectActivityPlan;
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetProjectActivityPlansbyID/{projectId}")]
        public IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlansbyID(int projectId)
        {
            var ProjectActivityPlan = _ProjectActivityPlan.GetProjectActivityPlansbyID(projectId);
            return ProjectActivityPlan;
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetStagesbyID/{projectId}")]
        public IEnumerable<ActivityTemplate> GetStagesbyID(int projectId)
        {
            var ProjectActivityPlan = _ProjectActivityPlan.GetStagesbyID(projectId);
            return ProjectActivityPlan;
        }

        [HttpGet]
        [Route("api/ProjectPlan/getActivitiesbyID/{projectId}/{templateid}")]
        public IEnumerable<ActivityModel> getActivitiesbyID(int projectId, int templateid)
        {
            var Activity = _ProjectActivityPlan.GetActivitiesbyID(projectId, templateid);
            return Activity;
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetProjectBarGraphData/{projectId}")]
        public ProjectPlanStausGraphModel getProjectBarGraphData(int projectId)
        {
            var Activity = _ProjectActivityPlan.GetProjectBarGraphData(projectId);
            return Activity;
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetProjectPlans/{projectId}")]
        public IEnumerable<ProjectPlan> GetProjectPlans(int projectId)
        {
            return _ProjectPlan.GetProjectPlans(projectId);
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetProjectActivityPlans/{projectId}")]
        public IEnumerable<ProjectActivityPlanModel> GetProjectActivityPlans(int projectId)
        {
            return _ProjectActivityPlan.GetProjectActivityPlans(projectId);
        }

        [HttpGet]
        [Route("api/ProjectPlan/IsActivityExist/{projectplanId}/{activity}")]
        public bool IsActivityExist(int projectplanId, string activity)
        {
            return _ProjectActivityPlan.IsActivitiesExist(projectplanId, activity);
        }

        [HttpGet]
        [Route("api/ProjectPlan/ValidateActivity/{projectplanId}/{activity}")]
        public int ValidateActivity(int projectplanId, int activity)
        {
            return _ProjectActivityPlan.ValidateActivity(projectplanId, activity);
        }

        [HttpGet]
        [Route("api/ProjectPlan/GetDependentDate/{activityid}/{projectplanId}/{type}")]
        public string GetDependentDate(int activityid,int projectplanid, string type)
        {
            return _ProjectActivityPlan.GetDependentDate(activityid, projectplanid, type);
        }


        [HttpGet]
        [Route("api/ProjectPlan/IsTaskExist/{projectplanId}/{task}")]
        public bool IsTaskExist(int projectplanId, string task)
        {
            return _ProjectActivityPlan.IsTaskExist(projectplanId, task);
        }


        public IHttpActionResult PostActivityProjectPlan(ProjectActivityPlan projectactivityplan)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            int i = Task.Run<int>(async () => await _ProjectActivityPlan.AddProjectActivityPlan(projectactivityplan)).Result;
            return Ok(i);
        }

        public IHttpActionResult PostActivityTaskPlan(ProjectActivityPlan projectactivityplan)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            int i = Task.Run<int>(async () => await _ProjectActivityPlan.AddProjectTaskPlan(projectactivityplan)).Result;
            return Ok(i);
        }


        [HttpDelete]
        [Route("api/ProjectPlan/DeleteProjectPlan/{ProjectPlanid}")]
        public IHttpActionResult DeleteProjectPlan(int ProjectPlanid)
        {
            if (ProjectPlanid > 0 && _ProjectPlan.DeleteProjectPlan(ProjectPlanid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpDelete]
        [Route("api/ProjectPlan/DeleteProjectActivityPlan/{ProjectActivityPlanid}")]
        public IHttpActionResult DeleteProjectActivityPlan(int ProjectActivityPlanid)
        {
            if (ProjectActivityPlanid > 0 && _ProjectActivityPlan.DeleteProjectActivityPlan(ProjectActivityPlanid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpPut]
        public IHttpActionResult UpdateProjectActivityPlan(ProjectActivityPlan projectactivityplan)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _ProjectActivityPlan.UpdateProjectActivityPlan(projectactivityplan));
            return Ok();
        }

        [HttpPut]
        public IHttpActionResult UpdateProjectPlan(ProjectPlan projectplan)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _ProjectPlan.UpdateProjectPlan(projectplan));
            return Ok();
        }
    }
}
