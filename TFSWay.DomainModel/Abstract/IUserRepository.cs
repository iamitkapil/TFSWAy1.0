using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IUserRepository
    {

        IEnumerable<User> Users { get; }
        IEnumerable<User> GetUsers();

    }
}
