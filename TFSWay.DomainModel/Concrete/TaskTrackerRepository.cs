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
    public class TaskTrackerRepository : ITaskTrackerRepository
    {

        private TFSWayDBContext db;
        public TaskTrackerRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<TaskTracker> TaskTrackers
        {
            get { return db.TaskTrackers; }
        }

        public IEnumerable<TaskTracker> GetTaskTrackers()
        {
            return this.TaskTrackers;

        }

        public async Task<int> AdTaskTrackers(TaskTracker tasktracker)
        {
            db.TaskTrackers.Add(tasktracker);
            await db.SaveChangesAsync();
            int insertedTaskTrackerid = tasktracker.TaskTrackerID;
            return insertedTaskTrackerid;
        }

        public async Task<TaskTracker> FetchbyDocumentById(int tasktrackerid)
        {
            TaskTracker tasktracker = await db.TaskTrackers.FindAsync(tasktrackerid);
            return tasktracker;
        }

        public async Task<int> UpdateTaskTracker(TaskTracker tasktracker)
        {
            TaskTracker existingtasktracker = await FetchbyDocumentById(tasktracker.TaskTrackerID);
            db.Entry(existingtasktracker).State = EntityState.Detached;
            db.Entry(tasktracker).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteTaskTracker(int tasktrackerid)
        {
            TaskTracker tasktracker = await FetchbyDocumentById(tasktrackerid);
            db.TaskTrackers.Remove(tasktracker);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

