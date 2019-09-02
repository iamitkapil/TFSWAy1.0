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
    public class CostBreakupController : ApiController
    {
        private ICostBreakup _costbreakup;

        public CostBreakupController(ICostBreakup costbreakup)
        {
            _costbreakup = costbreakup;
        }


        [HttpGet]
        public IEnumerable<CostBreakup> GetCostBreakups()
        {
            var costBreakups = _costbreakup.GetCostBreakups();
            return costBreakups;
        }


        public CostBreakup GetCostBreakupbyProjectId(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            CostBreakup costbreakup = _costbreakup.GetCostBreakupbyProjectId((int)id);
            return costbreakup;
        }

        [HttpPut]
        public IHttpActionResult UpdateCostBreakup(CostBreakup costbreakup)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            string message = Task.Run<string>(async () => await _costbreakup.UpdateCostBreakup(costbreakup)).Result;
            return Ok(message);
        }

    }
}
