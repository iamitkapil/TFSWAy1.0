using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using System.Threading.Tasks;

namespace TFSWay.WebApi.Controllers
{
    public class AgencyController : ApiController
    {
        private IAgency _agency;

        public AgencyController(IAgency agency)
        {
            _agency = agency;
        }


        [HttpGet]
        public IEnumerable<Agency> GetAgencys()
        {
            var agencys = _agency.GetAgencys(string.Empty);
            return agencys;
        }

        [HttpGet]
        [Route("api/Agency/GetAgencys/{agencytype}")]
        public IEnumerable<Agency> GetAgencys(string agencytype)
        {
            var agencys = _agency.GetAgencys(agencytype);
            return agencys;
        }

        public Agency GetAgency(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            Agency agency = _agency.GetAgency((int)id);
            return agency;
        }

        [HttpPut]
        public IHttpActionResult UpdateAgency(Agency agency)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _agency.UpdateAgency(agency));
            return Ok("updated sucessfully");
        }

        [HttpPost]
        public IHttpActionResult PostAgency(Agency agency)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _agency.AddAgency(agency));
            return Ok("Added successfully");
        }


        [HttpDelete]
        public IHttpActionResult DeleteAgency(int id)
        {
            if (id > 0 && _agency.DeleteAgency(id).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid agency id");
        }
    }
}