using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface IActivities
    {
        IEnumerable<ActivityTemplate> GetActivities();
        IEnumerable<ActivityTemplate> GetActivityByStage(int templateid);
        ActivityTemplate Getdepenedency(int activityid);
        IEnumerable<ActivityTemplate> GetStage();
        IEnumerable<ActivityTemplate> GetActivities(int activityid);
        Task<String> AddActivity(ActivityTemplate activities);
    }

}
