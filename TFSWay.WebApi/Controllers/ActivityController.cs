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
    public class ActivityController : ApiController
    {
        private IActivities _Activities;

        public ActivityController(IActivities Activities)
        {
            _Activities = Activities;
        }


        [HttpGet]
        [Route("api/Activities/GetActivities")]
        public IEnumerable<ActivityTemplate> GetActivities()
        {
            var Activities = _Activities.GetActivities();
            return Activities;
        }

        [HttpGet]
        [Route("api/Activities/GetStage")]
        public IEnumerable<ActivityTemplate> GetStage()
        {
            var stages = _Activities.GetStage();
            return stages;
        }

        [HttpGet]
        [Route("api/Activities/GetActivityByStage/{templateid}")]
        public IEnumerable<ActivityTemplate> GetActivityByStage(int templateid)
        {
            var stages = _Activities.GetActivityByStage(templateid);
            return stages;
        }

        [HttpGet]
        [Route("api/Activities/Getdepenedency/{activityid}")]
        public ActivityTemplate Getdepenedency(int activityid)
        {
            var stages = _Activities.Getdepenedency(activityid);
            return stages;
        }

        [HttpGet]
        [Route("api/Activities/GetActivities/{activityid}")]
        public IEnumerable<ActivityTemplate> GetActivities(int activityid)
        {
            return _Activities.GetActivities(activityid);
        }


        public IHttpActionResult PostActivity(ActivityTemplate activities)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            Task.Run(async () => await _Activities.AddActivity(activities));
            return Ok();
        }

    }
}
