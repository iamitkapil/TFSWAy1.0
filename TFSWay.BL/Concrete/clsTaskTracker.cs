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
    public class clsTaskTracker : ITaskTracker
    {
        private ITaskTrackerRepository TaskTrackerRepository;


        public clsTaskTracker(ITaskTrackerRepository tasktrackerrepository )
        {
            this.TaskTrackerRepository = tasktrackerrepository;
        }

        public IEnumerable<TaskTracker> GetTaskTrackers()
        {
            var tasktracker = TaskTrackerRepository.GetTaskTrackers();
            return tasktracker;
        }

        public IEnumerable<TaskTracker> GetTaskTrackers(int projectid)
        {
            IEnumerable<TaskTracker> tasktrackerlist = new List<TaskTracker>();
            tasktrackerlist = GetTaskTrackers().Where(c => (c.ProjectID == projectid));
            return tasktrackerlist;
        }

        public async Task<string> AddTaskTracker(TaskTracker tasktracker)
        {

            int insertedtasktrackerid = await TaskTrackerRepository.AdTaskTrackers(new TaskTracker { ProjectID = tasktracker.ProjectID, Task = tasktracker.Task, Responsible = tasktracker.Responsible, ResponsibleEmail=tasktracker.ResponsibleEmail, PlanDate = tasktracker.PlanDate, Status = tasktracker.Status, CreatedDate = tasktracker.CreatedDate, CreatedBy = tasktracker.CreatedBy });

            return insertedtasktrackerid != 0 ? "Successfully Insertion of task tracker record" : "Insertion failed";

        }

        public async Task<string> UpdateTaskTracker(TaskTracker tasktrackers)
        {

            TaskTracker tasktracker = TaskTrackerRepository.GetTaskTrackers().FirstOrDefault(c => c.TaskTrackerID == tasktrackers.TaskTrackerID);

            if (tasktracker == default(TaskTracker))
                return "tasktracker doen't exist";
            else
            {
                tasktracker.Task  = tasktrackers.Task;
                tasktracker.Responsible = tasktrackers.Responsible;
                tasktracker.PlanDate = tasktrackers.PlanDate.Value;
                tasktracker.Status = tasktrackers.Status;
            }

            int updatetasktracker = await TaskTrackerRepository.UpdateTaskTracker(tasktracker);

            return updatetasktracker == 0 ? "Successfully updated tasktracker and reply record" : "Updation failed";

        }
        public string DeleteTaskTracker(int tasktrackerid)
        {
            TaskTracker tasktracker = TaskTrackerRepository.GetTaskTrackers().SingleOrDefault(c => c.TaskTrackerID == tasktrackerid);

            int deletedtasktracker = Task.Run<int>(async () => await TaskTrackerRepository.DeleteTaskTracker(tasktrackerid)).Result;
            return deletedtasktracker > 0 ? "Successfully Deleted task tracker record" : "Deletion failed";
        }
    }
}
