using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;

namespace TFSWay.DomainModel.Abstract
{
    public interface ITaskTrackerRepository
    {

        IEnumerable<TaskTracker> TaskTrackers { get; }
        IEnumerable<TaskTracker> GetTaskTrackers();
        Task<int> AdTaskTrackers(TaskTracker tasktracker);
        Task<int> UpdateTaskTracker(TaskTracker tasktracker);
        Task<int> DeleteTaskTracker(int tasktrackerid);
 
    }
}