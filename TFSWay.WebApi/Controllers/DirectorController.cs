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
    public class DirectorController : ApiController
    {
        private IDirector _director;

        public DirectorController(IDirector director)
        {
            _director = director;
        }


        [HttpGet]
        public IEnumerable<DirectorListModel> GetDirectors(int id)
        {
            var directors = id == 0 ? _director.GetDirectorsLookupList(): _director.GetAllDirectors(id);
            return directors;
        }

       

        [HttpGet]
        public Director GetDirector(int? id)
        {
            if (id == null)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
            Director director = _director.GetDirector((int)id);
            return director;
        }

        [HttpPut]
        public IHttpActionResult UpdateDirector(Director director)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _director.UpdateDirector(director));
            return Ok("updated sucessfully");
        }


        [HttpPost]
        public IHttpActionResult PostDirector(Director director)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _director.AddDirector(director));
            return Ok();
        }

        [HttpDelete]
        public IHttpActionResult DeleteDirector(int id)
        {
            if (id > 0 && _director.DeleteDirector(id).ToString() != "Deletion failed")
                return Ok();
            else
                return BadRequest("Not a valid director id");
        }
    }
}
