using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.BL.Abstract;
using TFSWay.DomainModel.Entities;
using TFSWay.DomainModel.Abstract;
using TFSWay.BL.Model;
using TFSWay.BL.Extensions;

namespace TFSWay.BL.Concrete
{
    public class clsActivityTemplate : IActivities
    {
        private IActivitiesRepository ActivitiesRepository;


        public clsActivityTemplate(IActivitiesRepository activitiesrepository)
        {
            this.ActivitiesRepository = activitiesrepository;
        }

        public IEnumerable<ActivityTemplate> GetActivities()
        {
            var activities = ActivitiesRepository.GetActivities();
            return activities;
        }

        public IEnumerable<ActivityTemplate> GetActivities(int activityid)
        {
            IEnumerable<ActivityTemplate> activitieslist = new List<ActivityTemplate>();
            activitieslist = GetActivities().Where(c => (c.ActivityID == activityid));
            return activitieslist;
        }
        public ActivityTemplate Getdepenedency(int activityid)
        {

            ActivityTemplate activity = GetActivities().SingleOrDefault(c => (c.ActivityID == activityid));
            return activity;
        }

        public IEnumerable<ActivityTemplate> GetStage()
        {
            IEnumerable<ActivityTemplate> stages = ActivitiesRepository.GetActivities().Where(c => c.ParentID == 0);
            return stages;
        }

        public IEnumerable<ActivityTemplate> GetActivityByStage(int templateid)
        {
            IEnumerable<ActivityTemplate> activities = ActivitiesRepository.GetActivities().Where(c => c.ParentID == templateid);
            return activities;
        }


        public async Task<string> AddActivity(ActivityTemplate activities)
        {

            int insertedActivitiesid = await ActivitiesRepository.AddActivity(new ActivityTemplate { TemplateID = activities.TemplateID, Activity = activities.Activity, ParentID = activities.ParentID, Dependency = activities.Dependency, CreatedDate = activities.CreatedDate, CreatedBy = activities.CreatedBy, Description = activities.Description });

            return insertedActivitiesid != 0 ? "Successfully Insertion of activity record" : "Insertion failed";

        }

    }
}
