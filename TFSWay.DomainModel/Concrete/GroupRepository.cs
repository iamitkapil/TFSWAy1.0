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
    public class GroupRepository : IGroupRepository
    {
        private TFSWayDBContext db;
        public GroupRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<Group> Groups
        {
            get { return db.Groups; }
        }


        public IEnumerable<Group> GetGroups()
        {
            return this.Groups;

        }

        public async Task<Group> FetchbyGroupId(int groupid)
        {
            Group Group = await db.Groups.FindAsync(groupid);
            return Group;
        }

        public async Task<int> AddGroup(Group group)
        {
            db.Groups.Add(group);
            await db.SaveChangesAsync();
            int insertedgroupid = group.GroupId;
            return insertedgroupid;
        }

        public async Task<int> UpdateGroup(Group group)
        {
            Group existingGroup = await FetchbyGroupId(group.GroupId);
            db.Entry(existingGroup).State = EntityState.Detached;
            db.Entry(group).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteGroup(int groupid)
        {
            Group Group = await FetchbyGroupId(groupid);
            db.Groups.Remove(Group);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}
