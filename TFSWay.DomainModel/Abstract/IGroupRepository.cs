using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IGroupRepository
    {
        IEnumerable<Group> Groups { get; }
        IEnumerable<Group> GetGroups();
        Task<int> AddGroup(Group Group);
        Task<int> UpdateGroup(Group Group);
        Task<int> DeleteGroup(int id);
    }
}
