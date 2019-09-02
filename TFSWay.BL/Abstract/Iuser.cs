using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.BL.Abstract
{
    public interface IUser {

        User AuthenticateUser(string username, string password);
        IEnumerable<User> GetAuthorisedUsers();
        IEnumerable<User> GetUsersbyRole(UserType userType);
    }

    public enum UserType { Admin, PM , Supervisor };
}
