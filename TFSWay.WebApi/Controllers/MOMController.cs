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
    public class MOMController : ApiController
    {
        private IMOM _MOM;

        public MOMController(IMOM mom)
        {
            _MOM = mom;
        }


        [HttpGet]
        public IEnumerable<MOM> GetMOM()
        {
            var MOM = _MOM.GetMOMs();
            return MOM;
        }

        [HttpGet]
        public IEnumerable<MOM> GetMOMs()
        {
            var MOM = _MOM.GetMOMs();
            return MOM;
        }

        [HttpGet]
        [Route("api/MOM/GetMOMs/{projectId}")]
        public IEnumerable<MOM> GetMOMs(int projectId)
        {
            var MOM = _MOM.GetMOMs(projectId);
            return MOM;
        }

        [HttpGet]
        [Route("api/MOM/GetMOMTasks/{projectId}")]
        public IEnumerable<MOM> GetMOMTasks(int projectId)
        {
            var MOM = _MOM.GetMOMTasks(projectId);
            return MOM;
        }


        public IHttpActionResult PostMOM(MOM mom)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");
            int i = Task.Run<int>(async () => await _MOM.AddMOM(mom)).Result;
            return Ok(i);
        }


        [HttpDelete]
        [Route("api/MOM/DeleteMOM/{MOMId}")]
        public IHttpActionResult DeleteMOM(int MOMId)
        {
            if (MOMId > 0 && _MOM.DeleteMOM(MOMId).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Project id");
        }

        [HttpPut]
        public IHttpActionResult UpdateMOM(MOM mom)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _MOM.UpdateMOM(mom));
            return Ok();
        }
    }
}
