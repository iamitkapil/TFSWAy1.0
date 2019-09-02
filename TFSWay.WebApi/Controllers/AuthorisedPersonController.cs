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
    public class AuthorisedPersonController : ApiController
    {

        private IAuthorisedPerson _authorisedperson;

        public AuthorisedPersonController(IAuthorisedPerson authorisedperson)
        {
            _authorisedperson = authorisedperson;
        }



        [HttpGet]
        public IEnumerable<AuthorisedPersonModel> GetAuthorisedPersons(int id)
        {
            var authorisedpersons = id==0 ? _authorisedperson.GetAuthorisedPersonDetailList() : _authorisedperson.GetAuthorisedPersons(id);
            return authorisedpersons;
        }

        public AuthorisedPersonModel GetAuthorisedPerson(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            AuthorisedPersonModel authorisedperson = _authorisedperson.GetAuthorisedPerson((int)id);
            return authorisedperson;
        }

        [HttpPut]
        public IHttpActionResult UpdateAuthorisedPerson(AuthorisedPerson authorisedperson)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _authorisedperson.UpdateAuthorisedPerson(authorisedperson));
            return Ok("updated sucessfully");
        }

        [HttpPost]
        public IHttpActionResult PostAuthorisedPerson(AuthorisedPerson authorisedperson)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _authorisedperson.AddAuthorisedPerson(authorisedperson));
            return Ok();
        }

        [HttpDelete]
        public IHttpActionResult DeleteAuthorisedPerson(int id)
        {
            if (id > 0 && _authorisedperson.DeleteAuthorisedPerson(id).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid Authorised Person");
        }

    }
}
