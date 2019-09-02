using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Abstract;
using TFSWay.DomainModel.Entities;
using System.Data.Entity;

namespace TFSWay.DomainModel.Concrete
{
    public class UserRepository : IUserRepository
    {
        private TFSWayDBContext db;
        public UserRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<User> Users
        {
            get { return db.Users; }
        }


        public  IEnumerable<User> GetUsers()
        {
          return  this.Users;
           
        }



    }
}
