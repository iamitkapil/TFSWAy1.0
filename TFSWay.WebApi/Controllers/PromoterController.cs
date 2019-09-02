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
    public class PromoterController : ApiController
    {
        private IPromoter _promoter;

        public PromoterController(IPromoter promoter)
        {
            _promoter = promoter;
        }


        [HttpGet]
        public IEnumerable<Promoter> GetPromoters(int id)
        {
            var promoters = id == 0 ? _promoter.GetPromotersLookupList():_promoter.GetPromoters(id);
            return promoters;
        }


        public Promoter GetPromoter(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            Promoter promoter = _promoter.GetPromoter((int)id);
            return promoter;
        }

        [HttpPut]
        public IHttpActionResult UpdatePromoter(Promoter promoter)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _promoter.UpdatePromoter(promoter));
            return Ok("updated sucessfully");
        }

        [HttpPost]
        public IHttpActionResult PostPromoter(Promoter promoter)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _promoter.AddPromoter(promoter));
            return Ok("Added successfully");
        }


        [HttpDelete]
        public IHttpActionResult DeletePromoter(int id)
        {
            if (id > 0 && _promoter.DeletePromoter(id).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid promoter id");
        }

    }
}
