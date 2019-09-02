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
    public class TaskTrackerController : ApiController
    {
        private ITaskTracker _TaskTracker;

        public TaskTrackerController(ITaskTracker TaskTracker)
        {
            _TaskTracker = TaskTracker;
        }


        [HttpGet]
        public IEnumerable<TaskTracker> GetTaskTrackers()
        {
            var TaskTracker = _TaskTracker.GetTaskTrackers();
            return TaskTracker;
        }

        [HttpGet]
        [Route("api/TaskTracker/GetTaskTrackers/{projectId}")]
        public IEnumerable<TaskTracker> GetTaskTrackers(int projectId)
        {
            return _TaskTracker.GetTaskTrackers(projectId);
        }

        public IHttpActionResult PostTaskTracker(TaskTracker TaskTracker)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _TaskTracker.AddTaskTracker(TaskTracker));
            return Ok();
        }

        [HttpDelete]
        [Route("api/TaskTracker/DeleteTaskTracker/{TaskTrackerid}")]
        public IHttpActionResult DeleteTaskTracker(int TaskTrackerid)
        {
            if (TaskTrackerid > 0 && _TaskTracker.DeleteTaskTracker(TaskTrackerid).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid TaskTracker id");
        }

      

        [HttpPut]
        public IHttpActionResult UpdateTaskTracker(TaskTracker TaskTracker)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _TaskTracker.UpdateTaskTracker(TaskTracker));
            return Ok();
        }
    }
}
