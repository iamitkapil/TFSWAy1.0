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
    public class GroupController: ApiController
    {
        public IGroup _group;

        public GroupController(IGroup group)
        {
            _group = group;
        }

        [HttpGet]
        public IEnumerable<GroupCompanyModel> GetAllGroups()
        {
            var gcplist = _group.GetGCList();
            return gcplist;
        }

        [HttpGet]
        public IEnumerable<Group> GetGroups()
        {
            var groups = _group.GetGroups();
            return groups;
        }

        [HttpGet]
        [Route("api/Group/GetCompanys")]
        public IEnumerable<Company> GetCompanys()
        {
            var companys = _group.GetCompanys();
            return companys;
        }

        [HttpGet]
        [Route("api/Group/GetGroup/{id}")]
        public GroupCompanyModel GetGroup(int id)
        {
            GroupCompanyModel gcp  = _group.GetGC(id);
            return gcp;
        }


        [HttpPut]
        public IHttpActionResult UpdateGroup(GroupCompanyModel gcp)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            Task.Run(async () => await _group.UpdateGC(gcp));
            return Ok("Updated Successfully");
        }

        [HttpPost]
        public IHttpActionResult PostGroup(GroupCompanyModel gcp)
        {
            if (!ModelState.IsValid)
                return BadRequest("Not a valid model");
            string message =  Task.Run<string>(async () => await _group.AddGC(gcp)).Result;
            return Ok(message);
        }


        [HttpDelete]
        public IHttpActionResult DeleteGroup(GroupCompanyModel gcp)
        {
            if (gcp != default(GroupCompanyModel)  && _group.DeleteGC(gcp).ToString() != "Deletion failed")
                return Ok("Deleted successfully");
            else
                return BadRequest("Not a valid group");
        }

    }
}