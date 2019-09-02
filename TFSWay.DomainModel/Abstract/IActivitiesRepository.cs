using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface IActivitiesRepository
    {

        IEnumerable<ActivityTemplate> ActivityTemplates { get; }
        IEnumerable<ActivityTemplate> GetActivities();
        Task<int> AddActivity(ActivityTemplate activity);

    }
}