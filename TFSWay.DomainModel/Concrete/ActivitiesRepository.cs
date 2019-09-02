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
    public class ActivitiesRepository : IActivitiesRepository
    {

        private TFSWayDBContext db;
        public ActivitiesRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<ActivityTemplate> ActivityTemplates
        {
            get { return db.ActivityTemplates; }
        }

        public IEnumerable<ActivityTemplate> GetActivities()
        {
            return this.ActivityTemplates;

        }

        public async Task<int> AddActivity(ActivityTemplate activities)
        {
            db.ActivityTemplates.Add(activities);
            await db.SaveChangesAsync();
            int insertedActivitiesid = activities.ActivityID;
            return insertedActivitiesid;
        }

        public async Task<ActivityTemplate> FetchbyDocumentById(int activitiesid)
        {
            ActivityTemplate Activities = await db.ActivityTemplates.FindAsync(activitiesid);
            return Activities;
        }


    }
}

