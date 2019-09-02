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
    public class TeaserController : ApiController
    {
        private ITeaser _teaser;

        public TeaserController(ITeaser teaser)
        {
            _teaser = teaser;
        }


        [HttpGet]
        public IEnumerable<Teaser> GetTeasers(int id)
        {
            var teasers = _teaser.GetTeasers(id);
            return teasers;
        }


        [HttpGet]
        [Route("api/Teaser/GetNewTeaser/{projectid}")]
        public ProjectTeaserModel GetNewTeaser(int projectid)
        {
            var teaser = _teaser.GetNewTeaser(projectid);
            return teaser;

        }

        [HttpGet]
        public ProjectTeaserModel GetTeaser(int id)
        {
            var teaser = _teaser.GetTeaser(id);
            return teaser;

        }

        [HttpPost]
        public IHttpActionResult PostTeaser(Teaser teaser)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _teaser.AddTeaser(teaser));
            return Ok();
        }

        [HttpPut]
        public IHttpActionResult UpdateTeaser(Teaser teaser)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _teaser.UpdateTeaser(teaser));
            return Ok();
        }


    }
}
