using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;


namespace TFSWay.BL.Concrete
{
    public class clsUser : IUser
    {
        private IUserRepository UserRepository;

        public clsUser(IUserRepository authorisedpersonrepository)
        {
            this.UserRepository = authorisedpersonrepository;
        }
         
        public IEnumerable<User> GetAuthorisedUsers()
        {
            var UsersList = UserRepository.GetUsers();
            return UsersList;
        }
        public User AuthenticateUser(string username, string password)
        {
            //AuthorisedPerson user = default(AuthorisedPerson);
            User user = UserRepository.Users.FirstOrDefault(u => u.EmployeeId == username && u.Password == password);

            if (user == default(User))
                return new User { UserID = 0, EmployeeId = "Invalid user", FirstName = "", LastName = "", Email = "", Designation = "" };
            else
                return new User { UserID = user.UserID, EmployeeId = username, FirstName = user.FirstName, LastName = user.LastName, Email = user.Email, Designation = user.Designation };


        }

        public IEnumerable<User> GetUsersbyRole(UserType userType)
        {
            var UserList = UserRepository.Users.Where(u => u.Designation == userType.ToString()).Select(user => new User { UserID = user.UserID, EmployeeId = user.EmployeeId, FirstName = user.FirstName, LastName = user.LastName, Email = user.Email });
            return UserList;
        }
    }
}
