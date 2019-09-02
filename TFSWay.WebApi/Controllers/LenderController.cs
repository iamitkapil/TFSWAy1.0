using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using System.Threading.Tasks;
using TFSWay.BL.Model;

namespace TFSWay.WebApi.Controllers
{
    public class LenderController : ApiController
    {
        private ILender _lender;

        public LenderController(ILender lender)
        {
            _lender = lender;
        }

        [HttpGet]
        [Route("api/Lender/GetLendersbyProjectID/{id}")]
        public IEnumerable<LenderModel> GetLendersbyProjectID(int Id)
        {
            var lenders = _lender.GetLendersbyProjectID(Id);
            return lenders;
        }

        [HttpGet]
        [Route("api/Lender/GetLenders/{id}")]
        public IEnumerable<LenderModel> GetLenders(int Id)
        {
            var lenders = _lender.GetLenders(Id);
            return lenders;
        }


        [HttpGet]
        public IEnumerable<LenderModel> GetLenders()
        {
            var lenders = _lender.GetMasterLenders();
            return lenders;
        }



        [HttpPost]
        public IHttpActionResult PostLender(LenderModel lender)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _lender.AddLender(lender));
            return Ok("Record Added");
        }

        [HttpPut]
        public IHttpActionResult UpdateLender(LenderModel lender)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _lender.UpdateLender(lender));
            return Ok("Record Updated");
        }
    }
}
