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
    public class ProjectController : ApiController
    {
        private IProject _project;

        public ProjectController(IProject project)
        {
            _project = project;
        }


        [HttpGet]
        public IEnumerable<Project> GetProjects()
        {
            var projects = _project.GetProjects();
            return projects ;
        }

        [HttpGet]
        public int GetLastProjectID()
        {
            int projectID = _project.GetLastProjectID();
            return projectID;
        }

        [HttpGet]
        [Route("api/Project/GetDashBoardDetails/{employeeid}/{designation}")]
        public IEnumerable<ProjectCompanyModel> GetDashBoardDetails(int EmployeeId, string designation)
        {
            return _project.GetDashBoardData(EmployeeId, designation);
        }

        public ProjectCompanyModel GetProjectCompany(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            ProjectCompanyModel pcmodel = _project.GetProjectCompany((int)id);
            return pcmodel;
        }

        [HttpGet]
        public Project GetProject(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            Project project = _project.GetProject((int)id);
            return project;
        }


        public IHttpActionResult PostProject(Project project)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
           var str = Task.Run(async () => await _project.AddProject(project)).Result;
           return Ok(str);
        }

        //[HttpPut]
        //public IHttpActionResult UpdateProjectCompany(ProjectCompanyModel projectcompany)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest("Not a valid model");
        //    Task.Run(async () => await _project.UpdateProjectCompany(projectcompany));
        //    return Ok();
        //}

        [HttpDelete]
        [Route("api/Project/DeleteProject/{id}")]
        public IHttpActionResult DeleteProject(int id)
        {
            if (id > 0 && _project.DeleteProject(id).ToString() != "Deletion failed")
                return Ok("Project Deleted successfully");
            else
                return BadRequest("Not a valid Project");
        }

        [HttpPut]
        public IHttpActionResult UpdateProject(Project project)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            var str = Task.Run(async () => await _project.UpdateProject(project)).Result;
            return Ok(str);
        }

        [HttpPut]
        public IHttpActionResult UpdateProjectCompany(Project project)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            var str = Task.Run(async () => await _project.UpdateProjectCompany(project)).Result;
            return Ok(str);
        }

    }
}