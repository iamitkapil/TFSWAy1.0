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
    public class ClientDetailController: ApiController
    {

        private IClientDetail _clientdetail;

        public ClientDetailController(IClientDetail clientdetail)
        {
            _clientdetail = clientdetail;
        }


        [HttpGet]
        public IEnumerable<ClientDetail> GetClientDetails()
        {
            var clientDetails = _clientdetail.GetClientDetails();
            return clientDetails;
        }


        public ClientDetail GetClientDetailbyProjectId(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            ClientDetail projectclientdetails = _clientdetail.GetClientDetailbyProjectId((int)id);
            return projectclientdetails;
        }

        [HttpPut]
        public IHttpActionResult UpdateClient(ClientDetail clientdetail)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _clientdetail.UpdateClientDetail(clientdetail));
            return Ok();
        }

    }
}