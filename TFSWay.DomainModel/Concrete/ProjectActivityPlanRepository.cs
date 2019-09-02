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
    public class ProjectActivityPlanRepository : IProjectActivityPlanRepository
    {

        private TFSWayDBContext db;
        public ProjectActivityPlanRepository()
        {
            db = new Concrete.TFSWayDBContext();
        }

        public IEnumerable<ProjectActivityPlan> ProjectActivityPlans
        {
            get { return db.ProjectActivityPlans; }
        }

        public IEnumerable<ProjectActivityPlan> GetProjectActivityPlans()
        {
            return this.ProjectActivityPlans;

        }

        public async Task<int> AddProjectActivityPlan(ProjectActivityPlan projectactivityplan)
        {
            db.ProjectActivityPlans.Add(projectactivityplan);
            await db.SaveChangesAsync();
            int insertedProjectPlanid = projectactivityplan.ProjectActivityPlanID;
            return insertedProjectPlanid;
        }

        public async Task<ProjectActivityPlan> FetchbyDocumentById(int projectplanid)
        {
            ProjectActivityPlan projectactivityplan = await db.ProjectActivityPlans.FindAsync(projectplanid);
            return projectactivityplan;
        }



        public async Task<int> UpdateProjectActivityPlan(ProjectActivityPlan projectactivityplan)
        {
            ProjectActivityPlan existingProjectActivityplan = await FetchbyDocumentById(projectactivityplan.ProjectActivityPlanID);
            db.Entry(existingProjectActivityplan).State = EntityState.Detached;
            db.Entry(projectactivityplan).State = EntityState.Modified;
            int result = await db.SaveChangesAsync();
            return result;
        }

        public async Task<int> DeleteProjectActivityPlan(int projectactivityplanid)
        {
            ProjectActivityPlan projectactivityplan = await FetchbyDocumentById(projectactivityplanid);
            db.ProjectActivityPlans.Remove(projectactivityplan);
            int result = await db.SaveChangesAsync();
            return result;
        }

    }
}

