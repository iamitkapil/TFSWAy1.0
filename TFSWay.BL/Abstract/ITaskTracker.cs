using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFSWay.DomainModel.Entities;
using TFSWay.BL.Model;

namespace TFSWay.BL.Abstract
{
    public interface ITaskTracker
    {
        IEnumerable<TaskTracker> GetTaskTrackers();
        IEnumerable<TaskTracker> GetTaskTrackers(int tasktrackerid);
        Task<String> AddTaskTracker(TaskTracker tasktracker);
        Task<String> UpdateTaskTracker(TaskTracker tasktracker);
        String DeleteTaskTracker(int tasktrackerid);
    }

}
