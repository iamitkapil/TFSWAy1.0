using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;

namespace TFSWay.WebApi.Controllers
{
    public class UserController : ApiController
    {

        private IUser _user;

        public UserController(IUser user)
        {
            _user = user;
        }

        [HttpGet]
        [Route("api/User/AuthenticateUser/{username}/{password}")]
        public User AuthenticateUser(string username, string password)
        {
            User Loggeduser = this._user.AuthenticateUser(username, password);
            return Loggeduser;

        }

        [HttpGet]
        public  IEnumerable<User> GetAuthorisedUsers()
        {
            var users =  _user.GetAuthorisedUsers();
            return users;
        }

        [HttpGet]
        [Route("api/User/GetAuthorisedUsers/{userType}")]
        public IEnumerable<User> GetAuthorisedUsers(UserType userType)
        {
            var users = _user.GetUsersbyRole(userType);
            return users;
        }


    }
}
