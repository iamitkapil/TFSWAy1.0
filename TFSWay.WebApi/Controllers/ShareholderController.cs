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
    public class ShareholderController : ApiController
    {
        private IShareholder _shareholder;

        public ShareholderController(IShareholder shareholder)
        {
            _shareholder = shareholder;
        }


        [HttpGet]
        public IEnumerable<ShareholderListModel> GetShareholders(int id)
        {

            var shareholders = id == 0 ? _shareholder.GetShareholdersLookupList() : _shareholder.GetAllShareholders(id);
            return shareholders;
        }


        public Shareholder GetShareholder(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            Shareholder shareholder = _shareholder.GetShareholder((int)id);
            return shareholder;
        }

        [HttpPut]
        public IHttpActionResult UpdateShareholder(Shareholder shareholder)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _shareholder.UpdateShareholder(shareholder));
            return Ok("updated sucessfully");
        }


        [HttpPost]
        public IHttpActionResult PostShareholder(Shareholder shareholder)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _shareholder.AddShareholder(shareholder));
            return Ok();
        }

        [HttpDelete]
        public IHttpActionResult DeleteShareholder(int id)
        {
            if (id > 0 && _shareholder.DeleteShareholder(id).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid shareholder id");
        }
    }
}
